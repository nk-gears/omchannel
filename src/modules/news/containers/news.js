import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ActivityIndicator, ImageBackground, Text, TouchableWithoutFeedback, Alert, NetInfo } from 'react-native';
import { Card } from 'react-native-elements';
import { isEmpty } from 'lodash';

import AnimatedCard from '../../../components/animated/card';

import { loadNews } from '../store/actions';
import { getUpdatedAt, getNews } from '../store/selectors';
import { getTime } from '../../../helpers';

import styles from './styles';

const loaderImage = require('../../../../assets/images/loader.png');


class News extends Component {
    static propTypes = {
      news: PropTypes.arrayOf(PropTypes.object),
      updatedAt: PropTypes.number,
      loadNews: PropTypes.func.isRequired
    }

    static defaultProps = {
      news: [],
      updatedAt: 0
    }

    constructor(props) {
      super(props);

      this.state = {
        isReady: false,
        isConnected: true
      };
    }

    componentDidMount() {
      const { news, updatedAt, loadNews } = this.props;

      NetInfo.isConnected.fetch().then((isConnected) => {
        if (isConnected) {
          const diff = getTime(new Date(updatedAt), new Date());

          if (isEmpty(news) || (diff > 1)) {
            loadNews();
          } else {
            console.log('news already loaded, loading from props');
            this.setState({ isReady: true, isConnected: true });
          }
        } else {
          this.setState({ isReady: true, isConnected: false });
        }

        return isConnected;
      }).catch((e) => { console.log(e); });
    }

    componentWillReceiveProps() {
      this.setState({ isReady: true, isConnected: true });
    }

    onCardPress = (item) => {
      const { navigation } = this.props;
      navigation.navigate('NewsList', { news: item });
    }

    renderList = (items) => (
      <View style={styles.listView}>
        {items.map((i, index) => this.renderItem(i, index))}
      </View>
    );

    renderItem = (item, index) => (
      <AnimatedCard key={index} index={index}>
        <TouchableWithoutFeedback key={item.title} onPress={() => this.onCardPress(item)}>
          <Card
            image={{ uri: item.thumbnailUrl }}
            imageStyle={styles.cardImage}
            containerStyle={styles.cardContainer}
          >
            <Text numberOfLines={2} style={styles.cardTitle}>{item.title.toUpperCase()}</Text>
          </Card>
        </TouchableWithoutFeedback>
      </AnimatedCard>
    );

    showAlert = () => {
      Alert.alert(
        'Internet Error',
        'Please check your internet connection and try again later.',
        [{ text: 'OK', onPress: () => console.log('OK') }],
        { cancelable: false }
      );
    }

    render() {
      const { isReady, isConnected } = this.state;
      const { news } = this.props;

      const loadingInfo = (
        <ImageBackground
          imageStyle={{ resizeMode: 'cover' }}
          style={styles.loader}
          source={loaderImage}
        >
          <ActivityIndicator size="large" color="#5C5679" />
        </ImageBackground>
      );

      const loadContent = isConnected ? this.renderList(news) : this.showAlert();

      return (
        <ScrollView style={styles.container}>
          {isReady ? loadContent : loadingInfo}
        </ScrollView>
      );
    }
}


const mapStateToProps = (state) => ({
  news: getNews(state),
  updatedAt: getUpdatedAt(state)
});

function mapDispatchToProps(dispatch) {
  return {
    loadNews: () => dispatch(loadNews())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(News);
