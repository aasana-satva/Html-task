import { useEffect, useState } from "react";
import "./LiveNews.css";

function LiveNews() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true); 

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      const data = await response.json();

      setPosts(data); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="news-container">
      <h2 className="news-title">Live News</h2>

      <button className="refresh-btn" onClick={fetchPosts}>
        Refresh
      </button>

      {loading && <p className="loading">Loading...</p>}

      {!loading &&
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>{post.body}</p>
          </div>
        ))}
    </div>
  );
}

export default LiveNews;
