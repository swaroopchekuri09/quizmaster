// src/pages/QuizList.js
// Browse all published quizzes with topic filter and search

import { useState, useEffect } from 'react';
import { quizService, topicService } from '../services/api';
import QuizCard from '../components/QuizCard';
import Spinner from '../components/Spinner';

const QuizList = () => {
  const [quizzes, setQuizzes]   = useState([]);
  const [topics, setTopics]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [topicFilter, setTopicFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, tRes] = await Promise.all([
          quizService.getAll(),
          topicService.getAll(),
        ]);
        setQuizzes(qRes.data);
        setTopics(tRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Client-side filter
  const filtered = quizzes.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase());
    const matchTopic  = !topicFilter || q.topic?._id === topicFilter;
    return matchSearch && matchTopic;
  });

  if (loading) return <div style={{ paddingTop: '80px' }}><Spinner text="Loading quizzes..." /></div>;

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold mb-1"><i className="bi bi-collection me-2"></i>Available Quizzes</h1>
          <p className="mb-0 opacity-75">{filtered.length} quiz{filtered.length !== 1 ? 'zes' : ''} available</p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Filters */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="quiz-search"
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              id="topic-filter"
            >
              <option value="">All Topics</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => { setSearch(''); setTopicFilter(''); }}
            >
              <i className="bi bi-x-circle me-1"></i>Clear
            </button>
          </div>
        </div>

        {/* Topic Quick Filters */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className={`btn btn-sm rounded-pill ${!topicFilter ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTopicFilter('')}
          >All</button>
          {topics.map((t) => (
            <button
              key={t._id}
              className={`btn btn-sm rounded-pill ${topicFilter === t._id ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTopicFilter(t._id)}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Quiz Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-emoji-frown text-muted" style={{ fontSize: '4rem' }}></i>
            <h4 className="mt-3 text-muted">No quizzes found</h4>
            <p className="text-muted">Try changing your search or filter</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((quiz) => (
              <div className="col-md-6 col-lg-4" key={quiz._id}>
                <QuizCard quiz={quiz} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
