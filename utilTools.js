var http = require('http');
var util = require('util');

/**
 * 获取客户端ip，
 * param {req}
 * return 返回ip地址
 */
var _getClientIp = function (req) {
    var ipAddress;
    var forwardIpStr = req.headers['x-forwarded-for'];
    if (forwardIpStr) {
        var forwardIp = forwardIpStr.split(',');
        ipAddress = forwardIp[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAdress;
    }
    if (!ipAddress) {
        ipAddress = req.socket.remoteAdress;
    }
    if (!ipAddress) {
        if (req.connection.socket) {
            ipAddress = req.connection.socket.remoteAdress;
        }
        else if (req.headers['remote_addr']) {
            ipAddress = req.headers['remote_addr'];
        }
        else if (req.headers['client_ip']) {
            ipAddress = req.headers['client_ip'];
        }
        else {
            ipAddress = req.ip;
        }

    }
    return ipAddress;
};
exports.getClientIp = _getClientIp;

/**
 * 根据 ip 获取获取地址信息
 */
var _getIpInfo = function(ip, cb) {
	var sina_server = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
	var url = sina_server + ip;
	http.get(url, function(res) {
		var code = res.statusCode;
		if (code == 200) {
			res.on('data', function(data) {
				try {
					cb(null, JSON.parse(data));
				} catch (err) {
					cb(err);
				}
			});
		} else {
			cb({ code: code });
		}
	}).on('error', function(e) { cb(e); });
};

/**
 * 判断元素是否在数组中
 * ele 元素 ； arr 数组
 */
var _inArray = function(ele,arr){
    var b = false;
    if(arguments.length !== 2) return;
    if(!util.isArray(arr)) return;
    for(var i = 0;i<arr.length;i++){
        if(arr[i] === ele){
            b = true;
            break;
        }
    }

    return b
}

exports.getIpInfo = _getIpInfo;
exports.inArray = _inArray;
