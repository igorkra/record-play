import React, { Component } from 'react';
import { RaisedButton, FontIcon } from 'material-ui';
import { red500 } from 'material-ui/styles/colors';

class RecorderControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
       
        };
    }
    isDisabled() {
        return !!this.props.isRecording || !!this.props.isPlaying
    }
    render() {
        return (
            <div>
                <RaisedButton
                    label="Record"
                    disabled={this.isDisabled()}
                    onClick={this.props.onRecording}
                    icon={
                        <FontIcon className="material-icons"
                            color={this.props.isRecording ? red500 : ''}>
                            fiber_manual_record
            </FontIcon>} />
                <RaisedButton
                    label="Play"
                    disabled={this.isDisabled()}
                    onClick={this.props.onPlaying}
                    icon={
                        <FontIcon className="material-icons"
                            color={this.props.isPlaying ? red500 : ''}>
                            play_arrow
            </FontIcon>} />
                <RaisedButton
                    label="Save"
                    disabled={this.isDisabled() || !this.props.canSave}
                    onClick={this.props.onSave}
                    icon={<FontIcon className="material-icons">save</FontIcon>} />
            </div>
        );
    }
}

export default RecorderControl;
