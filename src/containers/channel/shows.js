import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, ScrollView, ActivityIndicator, ImageBackground, Text, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-elements';

import {isEmpty} from 'lodash';

import {loadShows} from '../../actions/channel';
import {getShows} from '../../resources/selectors';

import styles from './styles';


class Shows extends Component {
    static propTypes = {
        shows: PropTypes.arrayOf(PropTypes.object),
        loadShows: PropTypes.func
    }

    static defaultProps = {
        shows: []
    }

    constructor(props) {
        super(props);

        this.state = {
            isReady: false
        };
    }

    componentWillMount() {
        if (isEmpty(this.props.shows)) {
            this.props.loadShows();
        } else {
            console.log('shows already loaded, loading from props');
            this.setState({ isReady: true });
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ isReady: true });
    }

    _onCardPress = (item) => {
        this.props.navigation.navigate('ShowList', {show: item});
    }

    _renderList = (items) => {
        return (
            <View style={styles.listView}>
                {items.map(i => this._renderItem(i))}
            </View>
        );
    }

    _renderItem = (item) => {
        let count = item.playlists.length;

        return (
            <TouchableOpacity key={item.title} onPress={() => this._onCardPress(item)}>
                <Card
                    image={{uri: item.thumbnailUrl}}
                    imageStyle={styles.cardImage}
                    containerStyle={styles.cardContainer}>
                    <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
                    <Text numberOfLines={1} style={styles.cardSubtitle}>{count} Shows</Text>
                </Card>
            </TouchableOpacity>
        );
    }

    render() {
        const items = this.props.shows;

        let loadingInfo = (
            <ImageBackground
                imageStyle={{resizeMode: 'cover'}}
                style={{flex: 1, justifyContent: 'center'}}
                source={require('../../../assets/images/loader.png')}>
                <ActivityIndicator size="large" color="#5C5679" />
            </ImageBackground>
        );

        return (
            <ScrollView style={styles.content}>
                {this.state.isReady ? this._renderList(items) : loadingInfo}
            </ScrollView>
        );
    }
}


const mapStateToProps = state => ({
    shows: getShows(state)
});

function bindAction(dispatch) {
    return {
        loadShows: () => dispatch(loadShows())
    };
}

export default connect(mapStateToProps, bindAction)(Shows);
