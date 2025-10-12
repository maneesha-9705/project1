import React, { useState } from 'react';

const Discussion = ({ isLoggedIn }) => {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Best study techniques for finals",
      category: "academic",
      content: "Hi everyone! I'm looking for effective study techniques that have worked for you during finals season...",
      author: "John Doe",
      replies: 12,
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Internship opportunities in tech",
      category: "career",
      content: "Does anyone know of good internship opportunities in the tech field for this summer?",
      author: "Jane Smith",
      replies: 8,
      time: "4 hours ago"
    },
    {
      id: 3,
      title: "Campus events this weekend",
      category: "events",
      content: "What events are happening on campus this weekend? Looking for something fun to do!",
      author: "Mike Johnson",
      replies: 15,
      time: "6 hours ago"
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  });

  const categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'career', label: 'Career' },
    { value: 'events', label: 'Events' },
    { value: 'general', label: 'General' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('Please login to participate in discussions.');
      return;
    }

    if (formData.title && formData.category && formData.content) {
      const newDiscussion = {
        id: discussions.length + 1,
        title: formData.title,
        category: formData.category,
        content: formData.content,
        author: "You",
        replies: 0,
        time: "Just now"
      };

      setDiscussions([newDiscussion, ...discussions]);
      setFormData({ title: '', category: '', content: '' });

      // Show success message
      alert('Discussion posted successfully!');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="discussion-section">
      <div className="container">
        <div className="section-header">
          <h2>Discussion Forum</h2>
          <p>Share ideas, ask questions, and connect with fellow students</p>
        </div>

        <div className="discussion-container">
          {!isLoggedIn && (
            <div className="auth-required">
              <i className="fas fa-user-lock"></i>
              <h3>Login Required</h3>
              <p>Please login to participate in discussions and view existing topics.</p>
              <div className="auth-benefits">
                <h4>As a registered user, you can:</h4>
                <ul>
                  <li><i className="fas fa-check"></i> Start new discussions</li>
                  <li><i className="fas fa-check"></i> Reply to existing topics</li>
                  <li><i className="fas fa-check"></i> Connect with other students</li>
                  <li><i className="fas fa-check"></i> Share ideas and ask questions</li>
                </ul>
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="discussion-form">
              <h3>Start a New Discussion</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="title"
                    placeholder="Discussion Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <textarea
                    name="content"
                    placeholder="Share your thoughts..."
                    rows="5"
                    value={formData.content}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Post Discussion
                </button>
              </form>
            </div>
          )}

          <div className="discussion-topics">
            <h3>Recent Discussions</h3>
            {!isLoggedIn ? (
              <div className="topics-locked">
                <i className="fas fa-lock"></i>
                <p>Login to view and participate in discussions</p>
              </div>
            ) : (
              <div className="topics-list">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="topic-card">
                    <div className="topic-header">
                      <h4>{discussion.title}</h4>
                      <span className={`topic-category ${discussion.category}`}>
                        {discussion.category.charAt(0).toUpperCase() + discussion.category.slice(1)}
                      </span>
                    </div>
                    <div className="topic-content">
                      <p>{discussion.content}</p>
                    </div>
                    <div className="topic-meta">
                      <span className="author">{discussion.author}</span>
                      <span className="replies">{discussion.replies} replies</span>
                      <span className="time">{discussion.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Discussion;
