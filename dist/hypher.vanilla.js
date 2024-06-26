(function () {
    /**
     * Hypher Constructor
     * language - An object containing language patterns.
     */
    function Hypher(language) {
        this.trie = this.createTrie(language['patterns']);
    }

    /**
     * Creates a trie from a language pattern.
     */
    Hypher.prototype.createTrie = function (patternObject) {
        var size, i, c, p, chars, points, codePoint, t, tree = {
            _points: []
        }, patterns;

        for (size in patternObject) {
            if (patternObject.hasOwnProperty(size)) {
                patterns = patternObject[size].match(new RegExp('.{1,' + (+size) + '}', 'g'));

                for (i = 0; i < patterns.length; i += 1) {
                    chars = patterns[i].replace(/[0-9]/g, '').split('');
                    points = patterns[i].split(/\D/);
                    t = tree;

                    for (c = 0; c < chars.length; c += 1) {
                        codePoint = chars[c].charCodeAt(0);

                        if (!t[codePoint]) {
                            t[codePoint] = {};
                        }
                        t = t[codePoint];
                    }

                    t._points = [];

                    for (p = 0; p < points.length; p += 1) {
                        t._points[p] = points[p] || 0;
                    }
                }
            }
        }
        return tree;
    };

    /**
     * Hyphenates a text.
     */

    Hypher.prototype.hyphenateText = function (str, options) {

        minLength = options.minLength ? options.minLength : 4;
        //console.log(minLength);

        var words = str.split(/([a-zA-Z0-9_\u0027\u00DF-\u00EA\u00EC-\u00EF\u00F1-\u00F6\u00F8-\u00FD\u0101\u0103\u0105\u0107\u0109\u010D\u010F\u0111\u0113\u0117\u0119\u011B\u011D\u011F\u0123\u0125\u012B\u012F\u0131\u0135\u0137\u013C\u013E\u0142\u0144\u0146\u0148\u0151\u0153\u0155\u0159\u015B\u015D\u015F\u0161\u0165\u016B\u016D\u016F\u0171\u0173\u017A\u017C\u017E\u017F\u0219\u021B\u02BC\u0390\u03AC-\u03CE\u03F2\u0401\u0410-\u044F\u0451\u0454\u0456\u0457\u045E\u0491\u0531-\u0556\u0561-\u0587\u0902\u0903\u0905-\u090B\u090E-\u0910\u0912\u0914-\u0928\u092A-\u0939\u093E-\u0943\u0946-\u0948\u094A-\u094D\u0982\u0983\u0985-\u098B\u098F\u0990\u0994-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BE-\u09C3\u09C7\u09C8\u09CB-\u09CD\u09D7\u0A02\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A14-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A82\u0A83\u0A85-\u0A8B\u0A8F\u0A90\u0A94-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABE-\u0AC3\u0AC7\u0AC8\u0ACB-\u0ACD\u0B02\u0B03\u0B05-\u0B0B\u0B0F\u0B10\u0B14-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3E-\u0B43\u0B47\u0B48\u0B4B-\u0B4D\u0B57\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C02\u0C03\u0C05-\u0C0B\u0C0E-\u0C10\u0C12\u0C14-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3E-\u0C43\u0C46-\u0C48\u0C4A-\u0C4D\u0C82\u0C83\u0C85-\u0C8B\u0C8E-\u0C90\u0C92\u0C94-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBE-\u0CC3\u0CC6-\u0CC8\u0CCA-\u0CCD\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3E-\u0D43\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D60\u0D61\u0D7A-\u0D7F\u1F00-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB2-\u1FB4\u1FB6\u1FB7\u1FBD\u1FBF\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD2\u1FD3\u1FD6\u1FD7\u1FE2-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u200D\u2019]+)/g);

        for (var i = 0; i < words.length; i += 1) {
            if (words[i].indexOf('/') !== -1) {
                if (i !== 0 && i !== words.length - 1 && !(/\s+\/|\/\s+/.test(words[i]))) {
                    words[i] += '\u200B';
                }
            } else if (words[i].length > minLength) {
                words[i] = this.hyphenate(words[i], options).join('\u00AD');
            }
        }
        return words.join('');
    };

    /**
     * Hyphenates a word.
     */
    Hypher.prototype.hyphenate = function (word, options) {
        let characterPoints = [],
            points = [],
            result = [''];

        //merge defaults
        options = {
            ...{
                leftMin: 2,
                rightMin: 2,
                exceptions: [],
                minLength: 4
            },
            ...options
        }

        let { leftMin, rightMin, exceptions, minLength } = options


        // don't hyphen as excluded or to short
        if (exceptions.length && exceptions.includes(word) ) {
            return [word];
        }

        if (word.indexOf('\u00AD') !== -1) {
            return [word];
        }

        word = '_' + word + '_';

        let wordLength = word.length;
        let characters = word.toLowerCase().split('');
        let originalCharacters = word.split('');

        for (let i = 0; i < wordLength; i += 1) {
            points[i] = 0;
            characterPoints[i] = characters[i].charCodeAt(0);
        }

        for (let i = 0; i < wordLength; i += 1) {
            let node = this.trie;
            for (let j = i; j < wordLength; j += 1) {
                node = node[characterPoints[j]];

                if (node) {
                    let nodePoints = node._points;
                    if (nodePoints) {
                        for (let k = 0, nodePointsLength = nodePoints.length; k < nodePointsLength; k += 1) {
                            points[i + k] = Math.max(points[i + k], nodePoints[k]);
                        }
                    }
                } else {
                    break;
                }
            }
        }

        for (let i = 1; i < wordLength - 1; i += 1) {
            if (i > leftMin && i < (wordLength - rightMin) && points[i] % 2) {
                result.push(originalCharacters[i]);
            } else {
                result[result.length - 1] += originalCharacters[i];
            }
        }

        return result;
    };

    // Export Hypher
    window.Hypher = Hypher;
    window.Hypher.languages = {};
})();

(function () {
    /**
     * Hyphenates text using a specified language.
     */
    HTMLElement.prototype.hyphenate = function (language, options) {
        if (window.Hypher.languages[language]) {
            //let children  = [...this.children]
            let children  = [...this.childNodes]

            children.forEach(child=>{
                if(child.nodeType===3){
                    child.nodeValue =  window.Hypher.languages[language].hyphenateText(child.nodeValue, options)
                }else{
                    let textnodes = getTextNodesInEL(child)
                    textnodes.forEach(node=>{
                        node.nodeValue =  window.Hypher.languages[language].hyphenateText(node.nodeValue, options)
                    })
                }
            })
        }
    };
})();


function getTextNodesInEL(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }
    return nodes;
  }
