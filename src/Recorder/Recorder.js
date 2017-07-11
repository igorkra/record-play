import React, { Component } from 'react';
// import { RaisedButton, FontIcon, LinearProgress } from 'material-ui';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import Microphone from './Microphone';
import RecorderControl from './RecorderControl';
import axios from 'axios';

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordingTime: 2000,
      currentSentence: null,
      currentRecord: null,
      sentences: [
        "First sentence",
        "Second sentence",
        "Third sentence"
      ],
      records: [],
      isRecording: false,
      isPlaying: false
    };
    this.microphone = Microphone();
  }

  // Recording
  startRecording() {
    if (!this.state.isRecording) {
      this.setState({
        records: []
      })
    }

    let nextSentence = this.getNext(this.state.sentences, this.state.currentSentence);
    if (nextSentence) {
      this.microphone.startRecord();
      this.setState({
        isRecording: this.state.recordingTime,
        currentSentence: nextSentence
      });
      this.startTimer(this.state.recordingTime, () => {
        this.completeRecording().then(() => {
          this.startRecording();
        });
      });
    } else {
      this.stopRecording();
    }
  }
  stopRecording() {
    this.setState({
      isRecording: false,
      currentSentence: null
    })
    this.stopTimer();
  }
  completeRecording() {
    return this.microphone.stopRecord().then(audioUrl => {
      let newRecord = {
        sentence: this.state.currentSentence,
        audio: audioUrl
      }

      this.setState({
        records: [...this.state.records, newRecord]
      })
    })
  }

  // Playing
  startPlaying() {
    let nextRecord = this.getNext(this.state.records, this.state.currentRecord);
    if (nextRecord) {
      this.setState({
        isPlaying: true,
        currentRecord: nextRecord
      });
      let audioUrl = window.URL.createObjectURL(nextRecord.audio);
      let recordAudio = new Audio(audioUrl);
      recordAudio.play()
      // .then(() => {
      //   this.startPlaying();
      // })

      this.startTimer(this.state.recordingTime, () => {
        this.startPlaying();
      });
    } else {
      this.stopPlaying();
    }
  }
  stopPlaying() {
    this.setState({
      isPlaying: false,
      currentRecord: null
    })
    this.stopTimer();
  }

  // Timer
  stopTimer() {
    clearTimeout(this.timer);
  }
  startTimer(time, onEnd) {
    this.timer = setTimeout(() => {
      if (typeof onEnd === 'function') {
        onEnd();
      }
    }, time)
  }


  getNext(source, current) {
    if (current == null) {
      return source[0];
    }

    let currentIndex = source.indexOf(current);
    let nextIndex = currentIndex + 1;
    if (!source[nextIndex]) {
      return null;
    }
    return source[nextIndex];
  }

  saveRecords() {
    let data = new FormData();
    this.state.records.forEach((r, i) => {
      data.append('records[]', r.sentence, r.audio);
    });
    
    axios.post('/upload_file', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function () {
      alert('Sent');
    })
  }


  render() {
    return (
      <div className="recorder">
        <Card>
          <CardTitle title="Recorder"></CardTitle>
          <CardText>
            <ul className="sentences-list">
              {
                this.state.sentences.map(sentence =>
                  <li key={sentence} className={"sentences-list-item"
                    + (this.state.currentSentence === sentence ? " recording" : '')
                    + (this.state.currentRecord && this.state.currentRecord.sentence === sentence ? " playing" : '')}>
                    {sentence}
                  </li>
                )
              }
            </ul>
          </CardText>
          <CardActions>
            <RecorderControl
              isRecording={this.state.isRecording}
              isPlaying={this.state.isPlaying}
              onRecording={this.startRecording.bind(this)}
              onPlaying={this.startPlaying.bind(this)}
              onSave={this.saveRecords.bind(this)}
              canSave={!!this.state.records.length}
            />
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default Recorder;
