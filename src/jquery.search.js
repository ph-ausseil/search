/*
 * Search
 * Author : Pierre-Henri AUSSEIL <ph.ausseil@gmail.com>
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
*/
(function($){
	$.widget("ui.search", {
		options: {
			source: new Array(), //Iterable
			searchMethod : '_contains', //string or function
			quirck : 100
		},
		_create : function(){
			this.source = this.options.source;
			this._setSearchEngine(this.options.searchMethod);
			this._searchedString = new Array();
		},
		_setOption: function( key , value ) {
			if(key === "source"){
				this.source = value;
			}
			else if(key === "searchMethod"){
				this._setSearchEngine(value);
			}
			$.Widget.prototype._setOption.apply( this, arguments );
		},
		_setSearchEngine: function(){
			if(typeof this.options.searchMethod === 'string'){
				this.searchEngine = this[this.options.searchMethod];
			}
			else{
				this.searchEngine = this.options.searchMethod;
			}
			this.cache = new Array();
		},
		dosearch: function(value){
			if ( this._trigger("search") === false ){
				return;
			}

			var length = this.source.length, i = 0, response = new Array(), source = this.source;
			if(typeof value !== 'string'){//cache is restricted to string searches
				if(this.options.searchMethod.substr(0,2) === '_u')//@note is it a good practice ?
					return new Array();
			}
			else{
				if($.isArray(this.cache[value]) === true){
					return this.cache[value];
				}

				if(length > this.options.quirck){
					var tmp;
					for(i = 0 ; i < this._searchedString.length; i++ ){ //@todo Array.filter method but not compatible with IE6 i bilieve
						if(this._searchedString[i].length < this._searchedString[i].length)
							tmp[i] = this._searchedString[i];
					}
					tmp.sort(function(elm1 , elm2){
						if(elm1.length > elm2.length)
							return -1;
						else
							return 1;
					});

					for(i = 0 ; i < tmp.length ; i++){
						if(this.searchEngine(value, tmp[i] )){
							source = this.cache[tmp[i]];
							length = source.length;
							break;
						}
					}
				}
			}

			for(i = 0 ; i < length ; i++){
				if(this.searchEngine(source[i],  value ))
					response[response.length - 1] = source[i];
			}

			if(typeof value === 'string'){//only avalable for string searches
				this.cache[value] = response;
				this._searchedString.push(value);
			}

			return  response;
		},
		addsource:function(value){
			$.merge(this.source, value);
			this.cache = [];
		},
		_contains: function(sourceItem , value){
			return sourceItem.indexOf(value) !== -1;
		},
		_exactmatch: function(sourceItem , value){
			return sourceItem === value;
		},
		_beginwith: function(sourceItem , value){
			return sourceItem.substr(0, value.length) === value;
		},
		_ucontains: function(sourceItem , value){
			if(typeof sourceItem !== 'string')//@note is it a good idea ? should we test user imput ? if sourceItem isn't a string an error would fire.
				return false;
			return sourceItem.toLowerCase().indexOf(value.toLowerCase(), 0) !== -1;
		},
		_uexactmatch: function(sourceItem , value){
			if(typeof sourceItem !== 'string')//@note
				return false;
			return sourceItem.toLowerCase() === value.toLowerCase();
		},
		_ubeginwith: function(sourceItem , value){
			if(typeof sourceItem !== 'string')//@note
				return false;
			return sourceItem.toLowerCase().substr(0, value.length) === value.toLowerCase();
		}
	});
})(jQuery);