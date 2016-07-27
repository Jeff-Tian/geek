var ejs2jade = {};

function duplicateString(s, count) {
    var res = [];

    for (var i = 0; i < count; i++) {
        res.push(s);
    }

    return res.join('');
}

var CharType = {
    Letter: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_-{}[],;:.',
    TagStart: '<',
    TagEnd: '>',
    WhiteSpace: ' \n',
    Slash: '/',
    EqualSign: '=',
    DoubleQuote: '"',
    Unknown: '',
    Percentage: '%',
    EOF: 'EOF'
};

var States = {
    TagStart: '<',
    Tag: 'abc',
    WhiteSpace: ' ',
    Attribute: 'key',
    AttributeEnd: 'key\b',
    ValueStart: '"{',
    Value: 'value',
    ValueEnd: '}"',
    TagEnd: '>',
    ClosingTag: '</>',
    Start: 'START',
    End: 'END',
    Text: 'text',
    EJSCodeStart: '<%=',
    EJSCode: 'ejscode',
    EJSCodeEnd: '%>',
    Error: ''
};

function getCharType(c) {
    if (c === undefined) {
        return CharType.EOF;
    }

    for (var t in CharType) {
        if (CharType[t].indexOf(c) >= 0) {
            return CharType[t];
        }
    }

    return CharType.Letter;
}

var errors = [];

function raiseCharError(expectedTypes, actualType, i, line, col, char, caller, token, tagStack) {
    function interpretSpeicalChar(c) {
        if (c === '\n') {
            return '\\n';
        }

        return c;
    }

    var message = 'expect ' + expectedTypes.join(', ') + ', actual ' + actualType + '; at chart ' + i + ', line = ' + line + ', col = ' + col + ' , char = ' + char + '(' + interpretSpeicalChar(char) +
        ') with token = ' + token + ', ' +
        ' tagStack = ' + tagStack +
        '  caller = ' + (caller || arguments.callee);

    console.error(message);

    errors.push(message);
}

function raiseTagError(expectedTag, actualTag, i, line, col, char) {
    var message = 'expect ' + expectedTag + ', actual ' + actualTag + '; at char ' + i + ', line = ' + line + ', col = ' + col + ' , char = ' + char;

    console.error(message);
    errors.push(message);
}

function raiseOutOfStateError(i, line, col, char) {
    var m = 'out of state at char ' + i + ', line = ' + line + ', col = ' + col + ', char = ' + char;

    console.error(m);
    errors.push(m);
}

function trimExtra(ejs) {
    var extra = '<!DOCTYPE html>';

    if (ejs.indexOf(extra) === 0) {
        return ejs.substr(extra.length);
    }

    return ejs;
}

ejs2jade.convert = function (ejs) {
    ejs = trimExtra(ejs);

    var jade = '';
    var selfClosedTags = ['input', 'br', '!--', 'meta', 'link'];

    var i = 0;
    var line = 1;
    var col = 0;
    var token = '';
    var state = States.Start;
    var tagStack = [];
    var attrCount = 0;

    function changeState(newState) {
        console.log('changing state from ', state, ' to ', newState);
        state = newState;
    }

    console.log('============ start converting... =======');
    while (i <= ejs.length) {
        function re(expectedCharTypes, caller) {
            var callerName = caller || arguments.callee;

            callerName = callerName.toString();

            var index = callerName.indexOf(')');
            if (index >= 0) {
                callerName = callerName.substr(0, index + 1);
            }

            raiseCharError(expectedCharTypes, charType, i, line, col, c, callerName, token, tagStack);
        }

        function handleStart() {
            switch (charType) {
                case CharType.EOF:
                    state = States.End;
                    break;

                case CharType.TagStart:
                    state = States.TagStart;
                    break;

                default:
                    re([CharType.TagStart, CharType.EOF], arguments.callee);
                    break;
            }
        }

        function handleTagStart() {
            if (charType === CharType.Letter) {
                state = States.Tag;
                token += c;
            } else if (charType === CharType.Slash) {
                state = States.ClosingTag;
            } else if (charType === CharType.Percentage) {
                token = '';
                state = States.EJSCodeStart;
            } else {
                re([CharType.Letter, CharType.Slash, CharType.Percentage], arguments.callee);
            }
        }

        function handleEJSCodeStart() {
            if (charType === CharType.EqualSign) {
                state = States.EJSCode;
            } else {
                re([CharType.EqualSign], arguments.callee);
            }
        }

        function handleEJSCode() {
            if (charType === CharType.WhiteSpace) {

            } else if (charType === CharType.Letter) {
                token += c;
            } else if (charType === CharType.Percentage) {
                jade += ' #{' + token + '}';
                token = '';
                state = States.EJSCodeEnd;
            } else {
                re([CharType.WhiteSpace, CharType.Letter, CharType.Percentage], arguments.callee);
            }
        }

        function handleEJSCodeEnd() {
            if (charType === CharType.TagEnd) {
                state = States.TagEnd;
            } else {
                re([CharType.TagEnd], arguments.callee);
            }
        }

        function handleTag() {
            function rememberTag() {
                console.log('!!!remembering tag: ', token);

                if (tagStack.length > 0) {
                    console.log('indenting...');
                    jade += '\n';
                    jade += duplicateString('\t', tagStack.length);
                } else if (jade !== '') {
                    jade += '\n';
                }

                if (token !== '!--') {
                    jade += token;
                } else {
                    jade += '//';
                }

                tagStack.push(token);

                token = '';
            }

            if (charType === CharType.Letter) {
                token += c;
            } else if (charType === CharType.WhiteSpace) {
                rememberTag();
                attrCount = 0;
                state = States.WhiteSpace;
            } else if (charType === CharType.TagEnd) {
                rememberTag();
                attrCount = 0;
                state = States.TagEnd;
            } else {
                re([CharType.Letter, CharType.WhiteSpace, CharType.TagEnd], arguments.callee);
            }
        }

        function handleWhiteSpace() {
            if (charType === CharType.WhiteSpace) {
            } else if (charType === CharType.Letter) {
                jade += token;
                token = '';
                state = States.Attribute;
                token += c;
            } else {
                re([CharType.WhiteSpace, CharType.Letter], arguments.callee);
            }
        }

        function handleAttribute() {
            function rememberAttr() {
                jade += (attrCount === 0 ? '(' : ', ') + (token[0] === '*' || (token[0] === '(' && token[token.length - 1] === ')' || (token[0] === '[' && token[token.length - 1] === ']')) ? "'" + token + "'" : token);
                token = '';
                attrCount++;
            }

            if (charType === CharType.Letter) {
                token += c;
            } else if (charType === CharType.EqualSign) {
                rememberAttr();
                state = States.ValueStart;
            } else if (charType === CharType.TagEnd) {
                rememberAttr();
                state = States.ValueEnd;
                i--;
            } else if (charType === CharType.WhiteSpace) {
                rememberAttr();
                state = States.AttributeEnd;
            } else {
                re([CharType.Letter, CharType.EqualSign, CharType.TagEnd, CharType.WhiteSpace], arguments.callee);
            }
        }

        function handleAttributeEnd() {
            function rememberAttr() {
                jade += token + '=""';
                token = '';
            }

            if (charType === CharType.Letter) {
                rememberAttr();
                token += c;
                state = States.Attribute;
            } else if (charType === CharType.EqualSign) {
                state = States.ValueStart;
            } else if (charType === CharType.TagEnd) {
                // rememberAttr();
                state = States.ValueEnd;
                i--;
            } else if (charType === CharType.WhiteSpace) {

            } else {
                re([CharType.Letter, CharType.EqualSign, CharType.TagEnd, CharType.WhiteSpace], arguments.callee);
            }
        }

        function handleValueStart() {
            if (charType === CharType.DoubleQuote) {
                state = States.Value;
            } else {
                re([CharType.DoubleQuote], arguments.callee);
            }
        }

        function handleValue() {
            if (charType === CharType.Letter ||
                charType === CharType.WhiteSpace || charType === CharType.Slash || charType === CharType.EqualSign) {
                token += c;
            } else if (charType === CharType.DoubleQuote) {
                state = States.ValueEnd;
            } else {
                re([CharType.Letter, CharType.WhiteSpace, CharType.Slash, CharType.DoubleQuote, CharType.EqualSign], arguments.callee);
            }
        }

        function handleValueEnd() {
            function consumeTokenAsAttr() {
                jade += '="' + token + '"';
                token = '';
            }

            function appendTagEnd() {
                jade += ')';
            }

            if (charType === CharType.WhiteSpace) {

            } else if (charType === CharType.TagEnd) {
                consumeTokenAsAttr();
                appendTagEnd();
                changeState(States.TagEnd);
            } else if (charType === CharType.Letter) {
                consumeTokenAsAttr();
                token += c;
                changeState(States.Attribute);
            } else if (selfClosedTags.indexOf(tagStack[tagStack.length - 1]) >= 0) {

            } else {
                re([CharType.WhiteSpace, CharType.Attribute, CharType.TagEnd], arguments.callee);
            }
        }

        function handleTagEnd() {
            if (charType === CharType.EOF) {
                changeState(States.End);
            } else if (charType === CharType.TagStart) {
                if (selfClosedTags.indexOf(tagStack[tagStack.length - 1]) >= 0) {
                    tagStack.pop();
                }

                changeState(States.TagStart);
            } else if (charType === CharType.WhiteSpace) {
            } else if (charType === CharType.Letter) {
                token += c;
                changeState(States.Text);
            } else {
                re([CharType.EOF, CharType.TagStart, CharType.Letter], arguments.callee);
            }
        }

        function handleText() {
            if (charType === CharType.Letter || charType === CharType.WhiteSpace || charType === CharType.EqualSign) {
                token += c;
            } else if (charType === CharType.TagStart) {
                if (tagStack[tagStack.length - 1] === 'script') {
                    jade += '.\n' + duplicateString('\t', tagStack.length) + token;
                    token = '';
                    changeState(States.TagStart);
                } else {
                    jade += '\n' + duplicateString('\t', tagStack.length) + '| ' + token;
                    token = '';
                    changeState(States.TagStart);
                }
            } else {
                re([CharType.Letter, CharType.WhiteSpace, CharType.EqualSign, CharType.TagStart], arguments.callee);
            }
        }

        function handleClosingTag() {
            if (charType === CharType.Letter) {
                token += c;
            } else if (charType === CharType.TagEnd) {
                var closingTag = token;

                if (closingTag === tagStack[tagStack.length - 1]) {
                    tagStack.pop();
                } else {
                    raiseTagError(tagStack[tagStack.length - 1], closingTag, i, line, col, c);
                }

                token = '';
                state = States.TagEnd;
            } else {
                re([CharType.Letter, CharType.TagEnd], arguments.callee);
            }
        }

        function countLineNumber() {
            if (c === '\n') {
                line++;
                console.log('line = ', line);
                col = 0;
            }
        }

        console.log('--------- a loop --------------');
        var c = ejs[i];
        // console.log('c = ', c);
        var charType = getCharType(c);
        // console.log('charType = ', charType);

        countLineNumber();

        console.log('state = ', state);
        console.log('token = ', token);
        console.log('char = ', c, ' of ', charType);
        console.log('jade = ', jade);
        console.log('tagStack = ', tagStack);
        switch (state) {
            case States.Start:
                handleStart();
                break;
            case States.TagStart:
                handleTagStart();
                break;
            case States.Tag:
                handleTag();
                break;
            case States.WhiteSpace:
                handleWhiteSpace();
                break;
            case States.Attribute:
                handleAttribute();
                break;
            case States.ValueStart:
                handleValueStart();
                break;
            case States.Value:
                handleValue();
                break;
            case States.ValueEnd:
                handleValueEnd();
                break;
            case States.ClosingTag:
                handleClosingTag();
                break;
            case States.TagEnd:
                handleTagEnd();
                break;
            case States.Text:
                handleText();
                break;
            case States.EJSCodeStart:
                handleEJSCodeStart();
                break;
            case States.EJSCode:
                handleEJSCode();
                break;
            case States.EJSCodeEnd:
                handleEJSCodeEnd();
                break;
            case States.AttributeEnd:
                handleAttributeEnd();
                break;
            default :
                raiseOutOfStateError(i, line, col, c);
                break;
        }

        i++;
        col++;
    }

    console.log('========== end converting. ===========');

    return {
        ejs: ejs,
        jade: jade,
        errors: errors
    };
}
;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ejs2jade;
} else {
    window.ejs2jade = ejs2jade;
}