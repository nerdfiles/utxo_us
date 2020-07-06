# coding: utf-8
# python: 2.7.3
# module: btcelib.py <http://pastebin.com/kABSEyYB>

# Copyright (c)2014,2015 John Saturday <stozher@gmail.com>.
# The MIT License (MIT) <http://opensource.org/licenses/MIT>.
#
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation
# files (the "Software"), to deal in the Software without
# restriction, including without limitation the rights to use,
# copy, modify, merge, publish, distribute, sublicense, and/or
# sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following
# conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
# OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
# HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
# WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
# OTHER DEALINGS IN THE SOFTWARE.

# BTC-E IS NOT AFFILIATED WITH THIS PROJECT; THIS IS A COMPLETELY
# INDEPENDENT IMPLEMENTATION BASED ON THE BTC-E API DESCRIPTION.

# DONATION:
#     BTC: 13buUVsVXG5YwhmP6g6Bgd35WZ7bKjJzwM
#     LTC: Le3yV8mA3a7TrpQVHzpSSkBmKcd2Vw3NiR
#     NMC: N6pwdbjoLjyDoLjTdD7K66e84p1DCuecAE
#     PPC: PUVu3quW6MFsvmP5TbWeeG9TDtqZeNTETX

"""\
BTC-E Trade API v1 and BTC-E Public API v3

BTC-E Trade API v1 <https://btc-e.com/tapi/docs>.
BTC-E Public API v3 <https://btc-e.com/api/3/docs>.

EXAMPLES:
>>> import btcelib
>>> btcepapi = btcelib.PublicAPIv3('btc_usd-ltc_xxx')
>>> btcepapi.call('depth', limit=10, ignore_invalid=1)
... <OUTPUT>
>>> apikey = {'Key': <>, 'Secret': <>}
>>> btcetapi = btcelib.TradeAPIv1(apikey)
>>> btcetapi.call('TradeHistory', pair='btc_usd', count=10)
... <OUTPUT>

CLASSES:
    __builtin__.object
        BTCEConnection
            TradeAPIv1
            PublicAPIv3
    exceptions.Exception(exceptions.BaseException)
        APIError
    exceptions.IOError(exceptions.EnvironmentError)
        CloudFlare

exception btcelib.APIError(exceptions.Exception)
    Raise exception when the BTC-E API returned an error.

exception btcelib.CloudFlare(exceptions.IOError)
    Raise exception when the CloudFlare returned an error.

class btcelib.BTCEConnection([compr[, timeout]])
    HTTPS persistent connection to the Trade/Public API.

    BTCEConnection.apirequest(url[, apikey[, **params]])
    BTCEConnection.jsonrequest(url[, apikey[, **params]])

    BTCEConnection.conn - shared connection between pairs and methods
    BTCEConnection.resp - last response <type 'httplib.HTTPResponse'>

class btcelib.TradeAPIv1(apikey[, compr[, timeout]])
    BTC-E Trade API v1.

    TradeAPIv1.call(method[, **params]) - method: getInfo || Trade ||
    ActiveOrders || OrderInfo || CancelOrder || TradeHistory ||
    TransHistory (advanced: WithdrawCoin || CreateCoupon ||
    RedeemCoupon); params: param1=value1, param2=value2, ...

class btcelib.PublicAPIv3([pair[, compr[, timeout]]])
    BTC-E Public API v3.

    PublicAPIv3.call(method[, **params]) - method: info || ticker ||
    depth || trades; params: limit=150 (max 2000), ignore_invalid=1

EXCEPTIONS:
    btcelib.APIError, btcelib.CloudFlare,
    httplib.HTTPException, IOError, ValueError"""

__date__ = "2015-09-20 14:43:30 +0300"
__author__ = "John Saturday <stozher@gmail.com>"
__donation__ = """\
BTC: 13buUVsVXG5YwhmP6g6Bgd35WZ7bKjJzwM
LTC: Le3yV8mA3a7TrpQVHzpSSkBmKcd2Vw3NiR
NMC: N6pwdbjoLjyDoLjTdD7K66e84p1DCuecAE
PPC: PUVu3quW6MFsvmP5TbWeeG9TDtqZeNTETX"""
__copyright__ = """\
Copyright (c)2014,2015 John Saturday <stozher@gmail.com>.
The MIT License (MIT) <http://opensource.org/licenses/MIT>."""
__credits__ = "Alan McIntyre <https://github.com/alanmcintyre>"


import Cookie
import hmac
import httplib
import json
import re
import urllib
import warnings
import zlib

from decimal import Decimal
from hashlib import sha512

API_REFRESH = 2      #: refresh time of the API (seconds)
CONN_TIMEOUT = 60    #: HTTPS connection timeout (seconds)

CF_COOKIE = '__cfduid'     #: CloudFlare security cookie
BTCE_HOST = 'btc-e.com'    #: BTC-E host (HTTPS connection)
JSON_PARSER = Decimal      #: JSON float and integer data parser


class APIError(Exception):
    """\
    Raise exception when the BTC-E API returned an error."""
    pass

class CloudFlare(IOError):
    """\
    Raise exception when the CloudFlare returned an error."""
    pass

class BTCEConnection(object):
    """\
    HTTPS persistent connection to the Trade/Public API.
    @cvar conn: shared connection between all class methods
    @cvar resp: last response <type 'httplib.HTTPResponse'>"""

    _headers = {    #: default HTTPS headers
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'Accept-Encoding': 'gzip, deflate',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'}
    _post_headers = {    #: POST only HTTPS headers
            'Content-Type': 'application/x-www-form-urlencoded'}

    conn = None    #: shared connection between pairs and methods
    resp = None    #: last response <type 'httplib.HTTPResponse'>

    def __init__(self, compr=True, timeout=CONN_TIMEOUT):
        """\
        @param compr: connection compression (gzip, deflate)
        @param timeout: HTTPS connection timeout (seconds)
        @note: class-based 'compr' and 'timeout' vars"""

        self._compr = compr         #: HTTPS compression <type 'bool'>
        self._timeout = timeout     #: connection timeout <type 'int'>

        if not self._compr:
            BTCEConnection._headers['Accept-Encoding'] = 'identity'
        if BTCEConnection.conn:
            BTCEConnection.conn.timeout = self._timeout
        else:    # create new HTTPS connection
            BTCEConnection.conn = httplib.HTTPSConnection(
                    BTCE_HOST, strict=True, timeout=self._timeout)

    @classmethod
    def _cfcookie(cls):
        """\
        @raise RuntimeWarning: Missing CloudFlare cookie"""

        cookie_header = cls.resp.getheader('Set-Cookie')
        try:
            cfcookie = Cookie.SimpleCookie(cookie_header)[CF_COOKIE]
        except (KeyError, Cookie.CookieError):
            if 'Cookie' not in cls._headers:
                warnings.warn(u"Missing %r cookie" %
                        CF_COOKIE, RuntimeWarning, stacklevel=2)
            # pass: use previous 'Cookie' header
        else:
            cls._headers['Cookie'] = cfcookie.OutputString('value')

    @classmethod
    def _signature(cls, apikey, encoded_params):
        """\
        @param apikey: Trade API Key {'Key': <>, 'Secret': <>}
        @param encoded_params: Trade API method and parameters"""

        signature = hmac.new(apikey['Secret'],
                msg=encoded_params, digestmod=sha512)
        cls._post_headers.update({
                    'Key': apikey['Key'], 'Sign': signature.hexdigest()})

    @classmethod
    def apirequest(cls, url, apikey=None, **params):
        """\
        @raise HTTPException, IOError: connection errors
        @param url: Trade/Public API URL without parameters
        @param apikey: Trade API Key {'Key': <>, 'Secret': <>}
        @param **params: Trade/Public API method and/or parameters
        @return: response body (JSON data) <type 'str'>"""

        headers = cls._headers
        if 'tapi' in url:
            method = 'POST'
            encoded_params = urllib.urlencode(params)
            cls._signature(apikey, encoded_params)
            headers.update(cls._post_headers)
        else:    # Public API request
            method = 'GET'
            if params:
                url += '?%s' % urllib.urlencode(params)
            encoded_params = None

        try:
            cls.conn.request(method, url, encoded_params, headers)
            cls.resp = cls.conn.getresponse()
        # BadStatusLine, SSLError, socket.error (gaierror), etc.
        except (httplib.HTTPException, IOError):
            cls.conn.close()
            raise
        else:
            cls._cfcookie()

        jsondata = cls.resp.read()
        encoding = cls.resp.getheader('Content-Encoding')
        if encoding == 'gzip':
            jsondata = zlib.decompress(jsondata, zlib.MAX_WBITS+16)
        elif encoding == 'deflate':
            jsondata = zlib.decompress(jsondata, -zlib.MAX_WBITS)
        # else pass: encoding is an 'identity'
        return jsondata

    @classmethod
    def jsonrequest(cls, url, apikey=None, **params):
        """\
        @raise ValueError: when the data isn't a valid JSON document
        @raise CloudFlare: when the CloudFlare returned an error
        @raise APIError: when the BTC-E API returned an error
        @return: decoded JSON data response <type 'dict'>
        @see: BTCEConnection.apirequest"""

        jsondata = cls.apirequest(url, apikey, **params)

        try:
            data = json.loads(
                    jsondata, parse_float=JSON_PARSER, parse_int=JSON_PARSER)
        except ValueError:
            if cls.resp.status != 200:    # raise CloudFlare error
                raise CloudFlare(cls.resp.status, cls.resp.reason)
            else:    # raise BTC-E unknown error
                raise APIError(jsondata)
        else:
            if 'error' in data:    # raise BTC-E API error
                raise APIError(data['error'])
        return data

class TradeAPIv1(BTCEConnection):
    """\
    BTC-E Trade API v1.
    @see: <https://btc-e.com/tapi/docs>"""

    def __init__(self, apikey, **connkw):
        """\
        @param apikey: Trade API Key {'Key': <>, 'Secret': <>}
        @see: btcelib.BTCEConnection"""

        BTCEConnection.__init__(self, **connkw)
        self.apikey = apikey    #: Trade API Key <type 'dict'>
        self._nonce = None      #: incremental POST parameter ('int' > 0)

    def _nextnonce(self):
        """\
        @return: 'nonce' POST parameter <type 'int'>"""

        # 'nonce' automatic detection
        if not self._nonce:
            try:
                self.jsonrequest('/tapi', self.apikey, nonce=None)
            except APIError as error:
                if 'invalid nonce' in error.message:
                    self._nonce = int(re.search(r'\d+', error.message).group())
                else:    # other BTC-E API error
                    raise

        self._nonce += 1
        return self._nonce

    def call(self, method, **params):
        """\
        @param method: 'getInfo' || 'Trade' || 'ActiveOrders' ||
        'OrderInfo' || 'CancelOrder' || 'TradeHistory' || 'TransHistory'
        (advanced: 'WithdrawCoin' || 'CreateCoupon' || 'RedeemCoupon')
        @param **params: [param1=value1[, param2=value2[, ...]]]
        @return: <https://btc-e.com/tapi/docs>"""

        url = '/tapi'
        params = params or {}
        params.update({'method': method, 'nonce': self._nextnonce()})
        return self.jsonrequest(url, self.apikey, **params)['return']

class PublicAPIv3(BTCEConnection):
    """\
    BTC-E Public API v3.
    @see: <https://btc-e.com/api/3/docs>"""

    def __init__(self, pair=None, **connkw):
        """\
        @param pair: '[btc_usd[-ltc_btc[-ltc_usd[-...]]]]'
        @see: btcelib.BTCEConnection"""

        BTCEConnection.__init__(self, **connkw)
        self.pair = pair or 'btc_usd'    #: currency pairs <type 'str'>

        # all pairs: 'btc_usd-ltc_btc-ltc_usd-...'
        if not self.pair:
            info = self.call('info')
            self.pair = '-'.join(info['pairs'].iterkeys())

    def call(self, method, **params):
        """\
        @param method: 'info' || 'ticker' || 'depth' || 'trades'
        @param **params: [limit=150 (max 2000)[, ignore_invalid=1]]
        @return: <https://btc-e.com/api/3/docs>"""

        if method == 'info':
            url = '/api/3/%s' % method
        else:    # other Public API v3 methods
            url = '/api/3/%s/%s' % (method, self.pair)
        return self.jsonrequest(url, **params)
