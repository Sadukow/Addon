if (typeof(AvastWRC)=="undefined") { var AvastWRC = {};}
AvastWRC.gpb = {};

AvastWRC.gpb.All = PROTO.Message("AvastWRC.gpb.All",{
   
/*******************************************************************************
 * UrlInfo > UrlInfo
 ******************************************************************************/  
    UrlInfo : PROTO.Message('AvastWRC.gpb.All.UrlInfo',{
    	webrep: {
    		options: {},
    		multiplicity: PROTO.optional,
    		type: function(){return AvastWRC.gpb.All.WebRep;},
    		id: 1
        },
        phishing : {
     		options: {},
    		multiplicity: PROTO.optional,
    		type: function(){return AvastWRC.gpb.All.PhishingNew;},
    		id: 2       
        },
        blocker : {
     		options: {},
    		multiplicity: PROTO.optional,
    		type: function(){return AvastWRC.gpb.All.Blocker;},
    		id: 3       
        },
        typo : {
     		options: {},
    		multiplicity: PROTO.optional,
    		type: function(){return AvastWRC.gpb.All.Typo;},
    		id: 4       
        }
    
    }),             
/*******************************************************************************
 * UrlInfo > UrlInfoRequest
 ******************************************************************************/          
    UrlInfoRequest : PROTO.Message("AvastWRC.gpb.All.UrlInfoRequest",{
        Request : PROTO.Message("AvastWRC.gpb.All.UrlInfoRequest.Request",{
            	uri: {
            		options: {},
            		multiplicity: PROTO.repeated,
            		type: function(){return PROTO.string;},
            		id: 1
            	},
            	callerid: {
            		options: {},
            		multiplicity: PROTO.optional,
            		type: function(){return PROTO.sint64;},
            		id: 2
            	},
            	locale: {
            		options: {},
            		multiplicity: PROTO.optional,
            		type: function(){return PROTO.string;},
            		id: 3
            	},
            	apikey: {
            		options: {},
            		multiplicity: PROTO.optional,
            		type: function(){return PROTO.bytes;},
            		id: 4
            	},
            	identity: {
            		options: {},
            		multiplicity: PROTO.optional,
            		type: function(){return AvastWRC.gpb.All.Identity;},
            		id: 5
            	},
            	visited: {
            		options: {},
            		multiplicity: PROTO.optional,
            		type: function(){return PROTO.bool;},
            		id: 6
            	},
            	udpateRequest: {
            		options: {},
            		multiplicity: PROTO.optional,
            		type: function(){return AvastWRC.gpb.All.UpdateRequest;},
            		id: 7
            	},
                requestedServices : {
                    options: {},
                    multiplicity: PROTO.optional,
                    type: function(){return PROTO.sint32;}, 
                    id: 8
                }
        }),
        Response : PROTO.Message("AvastWRC.gpb.All.UrlInfoRequest.Response",{
                urlInfo: {
            		options: {},
            		multiplicity: PROTO.repeated,
            		type: function(){return AvastWRC.gpb.All.UrlInfo;},
            		id: 1
            	},
                updateResponse: {
            		options: {},
            		multiplicity: PROTO.optional,
            		type: function(){return AvastWRC.gpb.All.UpdateResponse;},
            		id: 2
            	}
        })
    }),
/*******************************************************************************
 * UrlInfo > Phishing
 ******************************************************************************/          
    PhishingNew : PROTO.Message("AvastWRC.gpb.All.PhishingNew",{
        	phishing: {
        		options: {},
        		multiplicity: PROTO.optional,
        		type: function(){return PROTO.sint32;},
        		id: 1
        	},
        	phishingDomain: {
        		options: {},
        		multiplicity: PROTO.optional,
        		type: function(){return PROTO.sint32;},
        		id: 2
        	},
        	ttl: {
        		options: {},
        		multiplicity: PROTO.optional,
        		type: function(){return PROTO.sint32;},
        		id: 3
        	}
    }),   
/*******************************************************************************
 * UrlInfo > WebRep
 ******************************************************************************/        
   WebRep : PROTO.Message("AvastWRC.gpb.All.WebRep",{
        	rating: {
        		options: {},
        		multiplicity: PROTO.optional,
        		type: function(){return PROTO.sint32;},
        		id: 1
        	},
        	weight: {
        		options: {},
        		multiplicity: PROTO.optional,
        		type: function(){return PROTO.sint32;},
        		id: 2
        	},
        	ttl: {
        		options: {},
        		multiplicity: PROTO.optional,
        		type: function(){return PROTO.sint32;},
        		id: 3
        	},
        	flags: {
        		options: {},
        		multiplicity: PROTO.optional,
        		type: function(){return PROTO.int64;},
        		id: 4
                    // bit mask:
                    //    shopping = 1
                    //    social = 2
                    //    news = 4
                    //    it = 8
                    //    corporate = 16
                    //    pornography = 32
                    //    violence = 64
                    //    gambling = 128
                    //    drugs = 256
                    //    illegal = 512

        	}
    }),  
});


/*


    Legacy messages



 */    
    
    
if (typeof(wrc_gpb)=="undefined") {wrc_gpb = {};}    
wrc_gpb.All = PROTO.Message("wrc_gpb.All",{    
    
/*******************************************************************************
 * Phishing
 ******************************************************************************/          
Phishing : PROTO.Message("wrc_gpb.All.Phishing",{
Request : PROTO.Message("wrc_gpb.All.Phishing.Request",{
	uri: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bytes;},
		id: 1
	}})
,
Response : PROTO.Message("wrc_gpb.All.Phishing.Response",{
	phishing: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.sint32;},
		id: 1
	},
	phishingDomain: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.sint32;},
		id: 2
	},
	ttl: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.sint32;},
		id: 3
	}})
}),
});


/*******************************************************************************
 *
 *  AvastWRC UTILS
 *  
 *  
 *  @author: Ondrej Masek   
 *
 ******************************************************************************/

AvastWRC.Utils = {
	/**
	 * Replace text format("Hello {0}, how are you {1} {2}", "Paul", "feeling", "today")
	 * @return {[type]} [description]
	 */
	format : function(){    
		var args = Array.prototype.slice.call(arguments, 0);
		var str = args.shift();

	    return str.replace(/{(\d+)}/g, function(match, number) { 
	      return typeof args[number] != 'undefined'
	        ? args[number]
	        : match
	      ;
	    });
	},
    S4 : function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
    getUniqueId : function() {
       return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
    },
    /**
     * Fix Boolean values from 1/0 or "1"/"0" to true/false
     * @param  {Number|String} n Original value
     * @return {[Bool}   Converted true/false value
     */
    fixBool : function(n){
        return (n==1 || n=='1') ? true : false;
    },
    /**
     * Strip URL and return the domain
     * @param  {String} url URL string (http://www.google.com)
     * @return {String}     Domain string (google.com)
     */
    getDomain : function(url) {
        /*if (url) {
            var url = url
                        .replace(/http:\/\/www./, "")
                        .replace(/http:\/\//, "")
                        .replace(/https:\/\/www./, "")
                        .replace(/https:\/\//, "");
            if(url.indexOf("/") > -1) {
                url = url.substring(0, url.indexOf("/"));
            }
        }
        return url;*/
        if(url === undefined || url == null) return null;
        
        var target = this.getUrlTarget(url); 
        if(target) url = 'http://'+target;
        
        var matches = url.match(new RegExp("^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(www.)?([a-z0-9\-\.]+[a-z]{2,6})(:[0-9]+)?(.*)?$"));
        if((matches) && (matches.length>4))
        {
            var protocol = matches[1];
            var credentials = matches[2];
            var www = matches[3];
            var domain = matches[4];
            var wport = matches[5];
            return domain;
        }
        return null;
    },
    /**
     * Look for redirector urls in 
     * @param  {String} url Original URL
     * @return {String}     Extracted URL
     */
    getUrlTarget : function(url){
        //Recognizes target urls inside arbitrary redirector urls (also handles base64 encoded urls)
        var args = this.getUrlVars(url);
        
        for(var p in args) {
            if(args.hasOwnProperty(p)) {
                //This regexp extracts domain from URL encoded address of type http
                try {
                    //Matches URLs starting with http(s)://domain.com http(s)://www.domain.com www.domain.com
                    //optionally followed by path and GET parameters
                    //If successfull then matches[4] holds the domain name with the www. part stripped
    
                    var re = /((https?\:\/\/(www\.)?|www\.)(([\w|\-]+\.)+(\w+)))([\/#\?].*)?/;
                    var decoded = decodeURIComponent(args[p]);
                    var matches = decoded.match(re);
                    if(matches) {
                        return matches[2]+matches[4];
                    }
    
                    var b64decoded = atob(decoded);
                    matches = b64decoded.match(re);         
                    if(matches) {
                        return matches[2]+matches[4];
                    }
                }
                catch(e)
                {
                    //alert("Exception: "+JSON.stringify(e));
                }
            }
        }
        return null;
    },
    /**
     * Create an object from arguments passed through GET
     * @param  {String} url URL string
     * @return {Object}     arguments as object
     */
    getUrlVars: function(url){
        //Creates an associative array of GET URL parameters
        var vars = {};
        if(url === undefined || url == null) return vars;
        var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value)
        {
            vars[key] = value;
        });
        
        return vars;
    },
    /**
     * Check if the URL can be handled by URL Info (compare agains IGNORE_TABS)
     * @param  {String} url URL String
     * @return {Boolean}    true - we can handle it
     */
    checkUrl : function (url) {
        if(!url || url == "") return false;
        for(var i=0, j=AvastWRC.DEFAULTS.IGNORE_TABS.length; i<j; i++) {
            if(url.indexOf(AvastWRC.DEFAULTS.IGNORE_TABS[i]) > -1 ) return false;
        }
        return true;
    
    },
    /**
     * PLACEHOLDER - browser specific - Verify that the tab still exists and has not been closed and execute action on it.
     * @param  {Number}   tabId    Tab Identification
     * @param  {Function} callback Function to be triggered on the tab
     * @return {void}
     */
    tabExists : function(tabId, callback){
        // extended by browser specific function
        if(callback) {
            // maintain context for the callback
            callback.call(self);
        } 
    },
    /**
     * PLACEHOLDER - browser specific - Execute script in a tab
     * @param  {Number}   id       Tab ID
     * @param  {Object}   options  Options to be passed to the executed script
     * @param  {Function} callback Callback function
     * @return {void}
     */
    executeScript : function(id, options, callback) {
        // extended by browser specific function
        if(callback) {
            // maintain context for the callback
            callback.call(self);
        }
    },
    /**
     * Manipulate bitmasks
     */
    BitWriter : function(n) {
    
        // local variables
    
        var bit = Math.abs(n),
            F = function() {},
            that = null;
    
        /**
         * Basic bitmask validate, a binary value should be 2^n power; this ensures the bit is valid by basic arithmetic
         * @method isValidBit
         * @return {Boolean} True, when a valid bitmask.
         * @private
         */
        var isValidBitmask = function(n) {
            if (0 > n) {return false;}
            var i = 0,
                j = 1;
    
            while (j <= n) {
                if (j === n) {return true;}
                i += 1;
                j = Math.pow(2, i);
            }
    
            return false;
        };
    
       // public interface
    
        F.prototype = {
    
            /**
             * Adds the bitmask to the binary value; remains unchanged if n is an invalid bitmask.
             * @method addBitmask
             * @param n {Number} Required. Any 2^n value.
             * @return {Number} The new binary value.
             * @public
             */
            addBitmask: function(n) {
                if (! isValidBitmask(n) || that.hasBitmask(n)) {return bit;}
                bit = (bit | n);
                return bit;
            },
    
            /**
             * Retrieves the binary value.
             * @method getValue
             * @return {Number} The binary value.
             * @public
             */
            getValue: function() {
                return bit;
            },
    
            /**
             * Tests if the bitmask is present, returning the bitmask when it is and ZERO otherwise.
             * @method hasBitmask
             * @param n {Number} Required. Any 2^n value.
             * @return {Number} The value of bitmask, when present, otherwise ZERO.
             * @public
             */
            hasBitmask: function(n) {
                if (! isValidBitmask(n) || n > bit) {return 0;}
                return (bit & n);
            },
    
            /**
             * Removes the bitmask to the binary value; remains unchanged if n is an invalid bitmask.
             *  When n > the binary number, then the number is simply reduced to ZERO.
             * @method removeBitmask
             * @param n {Number} Required. Any 2^n value.
             * @return {Number} The new binary value.
             * @public
             */
            removeBitmask: function(n) {
                if (! isValidBitmask(n) || ! that.hasBitmask(n)) {return bit;}
                bit = (bit ^ n);
                return bit;
            }
        };
    
        that = new F();
        return that;
    },
    /**
     * Get browser information
     * @type {Object}
     */
    Browser : {
        /**
         * Get Browser information
         * @param  {String} t What property are we querying ("browser|version|OS")
         * @return {String}   Property value
         */
        get: function (t) {
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent)
                || this.searchVersion(navigator.appVersion)
                || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
            
            return this[t];
        },
        /**
         * Look for specific data in userAgents
         * @param  {Object} data Where to look for
         * @return {String}      Resulting value
         */
        searchString: function (data) {
            for (var i=0;i<data.length;i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1)
                        return data[i].identity;
                }
                else if (dataProp)
                    return data[i].identity;
            }
        },
        /**
         * Search for browser version
         * @param  {String} dataString provided userAgent string to get the data from
         * @return {String}            Browser version
         */
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
        },
        /**
         * Individual settings for each browser
         * @type {Array}
         */
        dataBrowser: [
            {
                string: navigator.userAgent,
                subString: "Chrome",
                identity: "CHROME"
            },
            {
                string: navigator.vendor,
                subString: "Apple",
                identity: "SAFARI",
                versionSearch: "Version"
            },
            {
                prop: window.opera,
                identity: "OPERA",
                versionSearch: "Version"
            },
            {
                string: navigator.userAgent,
                subString: "Firefox",
                identity: "FIREFOX"
            },
        ],
        /**
         * Individual settings for each browser/OS
         * @type {Array}
         */
        dataOS : [
            {
                string: navigator.platform,
                subString: "Win",
                identity: "Windows"
            },
            {
                string: navigator.platform,
                subString: "Mac",
                identity: "Mac"
            },
            {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
            },
            {
                string: navigator.platform,
                subString: "Linux",
                identity: "Linux"
            }
        ]

    }
};
