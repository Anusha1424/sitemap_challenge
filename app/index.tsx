import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_KEY = 'a9745c9a991f45bdaeb3cf954b034234';

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

const App: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchArticles = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&from=2024-06-06&sortBy=publishedAt&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setArticles(data.articles);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  const handleSearchButtonPress = () => {
    if (search) {
      fetchArticles(search);
      Keyboard.dismiss(); // Close keyboard after button press
    }
  };

  const renderItem = ({ item }: { item: Article }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      {item.urlToImage && (
        <Image
          style={styles.image}
          resizeMode="cover"
          source={{ uri: item.urlToImage }}
        />
      )}
      <Text style={styles.author}>By {item.author}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Text style={styles.url}>{item.url}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Type Here..."
          onChangeText={handleSearchChange}
          value={search}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchButtonPress}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>Please search for something</Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    marginLeft: 10,
    height: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#777',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  author: {
    marginVertical: 10,
    fontStyle: 'italic',
  },
  description: {
    marginBottom: 10,
  },
  url: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default App;
