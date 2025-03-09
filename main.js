function getTextInfo(text) {
    speakingWPM = 170
    readingWPM = 238

    output = {
        words: 0,
        chars: 0,
        sentences: 0,
        speakingTime: 0,
        readingTime: 0,
        avgSentenceLen: 0,
        medianSentenceLen: 0,
        wordDensity: {}
    }

    output.chars = text.length;
    if (text.match(/\n/g)!=null) {
        output.chars-=text.match(/\n/g).length;
    }

    output.words = Math.min(output.chars,text.trim().split(/[ \n]+/).length);

    speakingTime = output.words/(speakingWPM/60);
    output.speakingTime = speakingTime;

    readingTime = output.words/(readingWPM/60);
    output.readingTime = readingTime;

    output.sentences = 0
    sentencePunc = '.?!\n'
    for (i=0;i<sentencePunc.length;i++) {
        punc = sentencePunc[i]
        for (j=0;j<text.split(punc).length;j++) {
            if (text.split(punc)[j].trim() != "") {
                output.sentences+=1
            }
        }
    }
    output.sentences = Math.max(output.sentences-3,0)

    return output
}

function updateSummary(analysis) {
    document.getElementById("word-count").innerText = "Words: "+(analysis.words);
    document.getElementById("char-count").innerText = "Characters: "+(analysis.chars);
    document.getElementById("sentence-count").innerText = "Sentences: "+(analysis.sentences);
}

function updateMainDisplay(analysis) {
    updatedText = []
    displayMode = document.getElementById("display-mode").value
    if (displayMode=='reading-time') {
        updatedText.push("Reading Time: "+toTime(analysis.readingTime))
        updatedText.push("Speaking Time: "+toTime(analysis.speakingTime))
    }

    console.log(updatedText,analysis.readingTime,analysis.speakingTime)
    document.getElementById("main-display").innerText = updatedText.join('\n\n')
}

function toTime(seconds) {
    if (seconds<3600) {
        var date = new Date(0);
        date.setSeconds(seconds);
        output = date.toISOString().substr(14, 5);
        if (output[0] == "0") {
            output = output.substr(1,4);
        }
    } else {
        var date = new Date(0);
        date.setSeconds(seconds);
        output = date.toISOString().substr(11, 8);
        if (output[0] == "0") {
            output = output.substr(1,8);
        }
    }
    return output
}

function _textBoxUpdate() {
    textbox = document.getElementById("text-input");
    newValue = textbox.value;
    analysis = getTextInfo(newValue);
    updateSummary(analysis)
    updateMainDisplay(analysis)
}

function _displayModeUpdate() {
    textbox = document.getElementById("text-input");
    newValue = textbox.value;
    analysis = getTextInfo(newValue);
    updateMainDisplay(analysis)
}

document.getElementById("text-input").addEventListener("input", _textBoxUpdate);
document.getElementById("display-mode").addEventListener("input", _displayModeUpdate);