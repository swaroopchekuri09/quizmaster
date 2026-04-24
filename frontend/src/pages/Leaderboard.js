// src/pages/Leaderboard.js
// Global & filtered leaderboard page

import { useState, useEffect } from 'react';
import { leaderboardService, topicService } from '../services/api';
import Spinner from '../components/Spinner';

const MEDALS = ['🥇','🥈','🥉'];

const Leaderboard = () => {
  const [data, setData]           = useState([]);
  const [topics, setTopics]       = useState([]);
  const [topicFilter, setTopicFilter] = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    topicService.getAll().then((r) => setTopics(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetch = topicFilter
      ? leaderboardService.byTopic(topicFilter)
      : leaderboardService.overall();
    fetch
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [topicFilter]);

  const formatTime = (sec) => {
    if (!sec) return '—';
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold"><i className="bi bi-trophy me-2"></i>Leaderboard</h1>
          <p className="mb-0 opacity-75">Top performers ranked by score and speed</p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Filters */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className={`btn btn-sm rounded-pill ${!topicFilter ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTopicFilter('')}
          ><i className="bi bi-globe me-1"></i>Overall</button>
          {topics.map((t) => (
            <button
              key={t._id}
              className={`btn btn-sm rounded-pill ${topicFilter === t._id ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTopicFilter(t._id)}
            >{t.name}</button>
          ))}
        </div>

        {loading ? <Spinner /> : data.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-trophy text-muted" style={{ fontSize: '4rem' }}></i>
            <h4 className="mt-3 text-muted">No data yet</h4>
            <p className="text-muted">Be the first to complete a quiz!</p>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            {data.length >= 3 && (
              <div className="row justify-content-center g-3 mb-4">
                {data.slice(0, 3).map((entry, i) => (
                  <div className="col-md-4" key={i}>
                    <div className={`card text-center border-0 shadow rounded-4 p-4 ${i === 0 ? 'border-top border-4 border-warning' : ''}`}>
                      <div style={{ fontSize: '2.5rem' }}>{MEDALS[i]}</div>
                      <div className="fw-bold fs-5 mt-1">{entry.userName}</div>
                      <div className="text-muted small mb-2">{entry.quizTitle}</div>
                      <div className="badge bg-primary px-3 py-2 rounded-pill">
                        {entry.score}/{entry.totalMarks} · {parseFloat(entry.percentage).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Full Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table leaderboard-table mb-0">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Quiz</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Time</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((entry, i) => (
                      <tr key={i} className={`rank-${i + 1 <= 3 ? i + 1 : ''}`}>
                        <td>
                          <span className="fw-bold">
                            {i < 3 ? MEDALS[i] : `#${entry.rank}`}
                          </span>
                        </td>
                        <td className="fw-semibold">{entry.userName}</td>
                        <td><span className="text-muted small">{entry.quizTitle}</span></td>
                        <td>{entry.score}/{entry.totalMarks}</td>
                        <td>
                          <div className="progress" style={{ height: '6px', width: '80px' }}>
                            <div className="progress-bar bg-success" style={{ width: `${entry.percentage}%` }}></div>
                          </div>
                          <small>{parseFloat(entry.percentage).toFixed(1)}%</small>
                        </td>
                        <td>{formatTime(entry.timeTaken)}</td>
                        <td>
                          <span className={`badge ${entry.isPassed ? 'bg-success' : 'bg-danger'}`}>
                            {entry.isPassed ? 'Pass' : 'Fail'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
