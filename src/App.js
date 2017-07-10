import React, { Component } from 'react';
import {MuiThemeProvider} from 'material-ui';
import { Recorder } from './Recorder';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>

        <Recorder />
      </MuiThemeProvider>
    );
  }
}

export default App;
