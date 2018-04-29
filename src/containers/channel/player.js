import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, WebView} from 'react-native';

import {getApiKey} from '../../resources/selectors';

import styles from './styles';


class ShowPlayer extends Component {
    static propTypes = {
        apiKey: PropTypes.string
    }

    static defaultProps = {
        apiKey: ''
    }

    constructor(props) {
        super(props);

        this.state = {
            video: this.props.navigation.state.params.video
        };
    }

    render() {
        let url = `https://www.youtube.com/embed/${this.state.video.videoId}`;

        return (
            <View style={styles.content}>
                <WebView
                    source={{uri: url}}
                    startInLoadingState
                    scalesPageToFit
                    javaScriptEnabled
                    style={{flex: 1}} />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    apiKey: getApiKey(state)
});

export default connect(mapStateToProps, null)(ShowPlayer);