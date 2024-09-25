import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function NewsGenerator() {
  const [input, setInput] = useState("");
  const [articleCount, setArticleCount] = useState(300);
  const [newsData, setNewsData] = useState([]);
  const [selectedNews, setSelectedNews] = useState([]);
  const [generatedNews, setGeneratedNews] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullArticles, setFullArticles] = useState([]);
  const [showFullArticles, setShowFullArticles] = useState(false);

  const retrieveNews = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/retrieved_news",
        {
          input: input,
        }
      );
      setNewsData(response.data.news);
    } catch (error) {
      console.error("Error retrieving news:", error);
    } finally {
      setLoading(false);
    }
  };
  const generateNews = async () => {
    setLoading(true);
    setFullArticles([]);
    setSelectedNews([]);
    setGeneratedNews("");
    const selectedIds = selectedNews.map((news) => news.meta.id);
    const selectedDates = selectedNews.map((news) => news.meta.date);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/generated_news",
        {
          input: input,
          article_count: articleCount,
          news_id: selectedIds,
          date: selectedDates,
        }
      );
      setGeneratedNews(response.data.response);
      setFullArticles(response.data.full_articles);
    } catch (error) {
      console.error("Error retrieving news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-generator">
      <h1 className="title">新聞生成AI</h1>
      <p className="description">
        🤖
        我是新聞生成AI！給我一段內容，我可以依據你輸入的內容，提供過去和此內容相關的新聞，
        你可以勾選想要參考的新聞，我會幫你生成一篇完整的文章。
      </p>
      <p className="data-info">💾 目前新聞資料有2024/01～2024/05的資料</p>

      <div className="input-section">
        <textarea
          className="news-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入新聞內容"
          rows="5"
          cols="50"
        />
      </div>

      <div className="article-count-section">
        <label>
          文章字數:
          <input
            className="article-count-input"
            type="number"
            step="100"
            value={articleCount}
            onChange={(e) => setArticleCount(e.target.value)}
          />
        </label>
      </div>

      <div className="button-section">
        <button className="retrieve-button" onClick={retrieveNews}>
          檢索相關新聞
        </button>
      </div>

      {newsData.length > 0 && (
        <div className="news-selection">
          <h2 className="news-selection-title">選擇參考新聞</h2>
          {newsData.map((news, index) => (
            <label key={index} className="news-item">
              <input
                type="checkbox"
                checked={selectedNews.includes(news)}
                onChange={() => {
                  if (selectedNews.includes(news)) {
                    setSelectedNews(selectedNews.filter((n) => n !== news));
                  } else {
                    setSelectedNews([...selectedNews, news]);
                  }
                }}
              />
              <strong>{news.meta.date}</strong> {news.meta.title}
              <p className="news-summary">摘要: {news.meta.summary}</p>
            </label>
          ))}
        </div>
      )}
      {newsData.length > 0 && (
        <div className="button-section">
          <button
            className="generate-button"
            onClick={generateNews}
            disabled={loading}
          >
            生成新聞
          </button>
        </div>
      )}

      {loading && (
        <div className="loading">
          <p>Loading...</p>
        </div>
      )}

      {generatedNews && (
        <div className="generated-news">
          <h2 className="generated-news-title">生成的新聞</h2>
          <p>{generatedNews}</p>
        </div>
      )}

      {fullArticles.length > 0 && (
        <div className="button-section">
          <button
            className="show-full-articles-button"
            onClick={() => setShowFullArticles(!showFullArticles)} // 切換顯示狀態
          >
            {showFullArticles ? "隱藏參考文章" : "顯示參考文章"}
          </button>
        </div>
      )}

      {showFullArticles && fullArticles.length > 0 && (
        <div className="full-articles">
          <h2>參考文章</h2>
          {fullArticles.map((article, index) => (
            <div key={index} className="full-article">
              <p>
                {index + 1}. {article.news_title}
              </p>
              <p>{article.news_content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsGenerator;
