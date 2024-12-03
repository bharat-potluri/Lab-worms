import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBBadge,
  MDBTypography,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBTextArea
} from 'mdb-react-ui-kit';
import { useAuth } from './AuthContext';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import './discussions.css';

// Sample discussion data with replies and interactions
const mockDiscussions = [
    {
      id: 1,
      title: "Help with Two Sum problem optimization",
      content: "I'm trying to optimize my solution for the Two Sum problem. Currently using nested loops with O(n²) complexity. I've tried using a hash map but still getting TLE on large inputs. Here's my current code:\n\n```python\ndef twoSum(self, nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []\n```\n\nAny suggestions for improvement?",
      author: "AlgorithmNewbie",
      authorAvatar: "AN",
      timestamp: "2024-03-19T10:30:00",
      tags: ["algorithms", "optimization", "arrays"],
      likes: 24,
      replies: [
        {
          id: 101,
          author: "OptimizationPro",
          authorAvatar: "OP",
          content: "You can solve this in O(n) time using a hash map. Here's how:\n\n```python\ndef twoSum(self, nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n```\n\nThis way, you only need to traverse the array once!",
          timestamp: "2024-03-19T10:45:00",
          likes: 15,
          isAccepted: true
        },
        {
          id: 102,
          author: "CodeMaster",
          authorAvatar: "CM",
          content: "Just to add to @OptimizationPro's solution - the hash map approach gives us a space-time tradeoff. We're using O(n) extra space to achieve O(n) time complexity.",
          timestamp: "2024-03-19T11:00:00",
          likes: 8,
          isAccepted: false
        },
        {
          id: 103,
          author: "AlgorithmNewbie",
          authorAvatar: "AN",
          content: "Thank you both! I implemented the hash map solution and it worked perfectly. My submission went from timing out to beating 95% of solutions!",
          timestamp: "2024-03-19T11:15:00",
          likes: 5,
          isAccepted: false
        }
      ],
      views: 156
    },
    {
      id: 2,
      title: "Understanding Merge Sort vs Quick Sort",
      content: "I'm studying sorting algorithms and I'm confused about when to use Merge Sort vs Quick Sort. What are the practical scenarios where one would be preferred over the other?",
      author: "SortingStudent",
      authorAvatar: "SS",
      timestamp: "2024-03-19T09:15:00",
      tags: ["algorithms", "sorting", "comparison"],
      likes: 42,
      replies: [
        {
          id: 201,
          author: "AlgorithmGuru",
          authorAvatar: "AG",
          content: "Great question! Here's a breakdown:\n\nMerge Sort:\n- Guaranteed O(n log n)\n- Stable sort\n- Uses extra space O(n)\n- Better for linked lists\n\nQuick Sort:\n- Average O(n log n), worst O(n²)\n- In-place sorting\n- Usually faster in practice\n- Better for arrays\n\nUse Merge Sort when:\n1. Stability is required\n2. Dealing with linked lists\n3. Predictable performance is needed\n\nUse Quick Sort when:\n1. Working with arrays\n2. Memory space is a concern\n3. Average case performance is more important",
          timestamp: "2024-03-19T09:30:00",
          likes: 28,
          isAccepted: true
        },
        {
          id: 202,
          author: "PracticalDev",
          authorAvatar: "PD",
          content: "In real-world applications, I've found that Quick Sort performs better on smaller datasets due to better cache utilization. Most programming languages' built-in sorting functions use a hybrid approach - QuickSort for larger partitions and insertion sort for smaller ones.",
          timestamp: "2024-03-19T09:45:00",
          likes: 15,
          isAccepted: false
        }
      ],
      views: 289
    },
    {
      id: 3,
      title: "System Design: Load Balancer Implementation",
      content: "Working on implementing a load balancer for my distributed system. Currently considering between Round Robin and Least Connections. Any recommendations based on real-world experience?",
      author: "SystemArchitect",
      authorAvatar: "SA",
      timestamp: "2024-03-18T22:45:00",
      tags: ["system-design", "scalability", "architecture"],
      likes: 56,
      replies: [
        {
          id: 301,
          author: "CloudExpert",
          authorAvatar: "CE",
          content: "Your choice should depend on your workload:\n\nRound Robin:\n✅ Simple to implement\n✅ Works well with homogeneous servers\n❌ Doesn't consider server load\n\nLeast Connections:\n✅ Better handles varying request loads\n✅ Adapts to server capacity\n❌ More complex implementation\n\nI'd suggest starting with Round Robin and implementing health checks. Monitor your metrics and switch to Least Connections if you see uneven load distribution.",
          timestamp: "2024-03-18T23:00:00",
          likes: 32,
          isAccepted: true
        },
        {
          id: 302,
          author: "ScalabilityPro",
          authorAvatar: "SP",
          content: "Also consider using weighted variants of these algorithms if your servers have different capacities. We use weighted least connections in production with great results.",
          timestamp: "2024-03-18T23:15:00",
          likes: 18,
          isAccepted: false
        },
        {
          id: 303,
          author: "SystemArchitect",
          authorAvatar: "SA",
          content: "Thanks for the detailed responses! We decided to go with Round Robin initially with health checks. Will monitor and adjust based on metrics.",
          timestamp: "2024-03-18T23:30:00",
          likes: 8,
          isAccepted: false
        }
      ],
      views: 478
    },
    {
      id: 4,
      title: "Mock Interview Experience: Google SDE",
      content: "Just finished my mock interview for Google SDE position. Thought I'd share my experience and some tips that helped me prepare.",
      author: "InterviewPrep",
      authorAvatar: "IP",
      timestamp: "2024-03-18T20:30:00",
      tags: ["interview-prep", "google", "experience"],
      likes: 89,
      replies: [
        {
          id: 401,
          author: "GoogleEngineer",
          authorAvatar: "GE",
          content: "As someone who conducts interviews at Google, here are some additional tips:\n\n1. Always think out loud\n2. Start with a brute force solution\n3. Optimize step by step\n4. Consider edge cases\n5. Write clean, modular code\n\nThe process is as important as the solution!",
          timestamp: "2024-03-18T21:00:00",
          likes: 45,
          isAccepted: true
        },
        {
          id: 402,
          author: "InterviewPrep",
          authorAvatar: "IP",
          content: "That's super helpful! During my mock interview, thinking out loud really helped the interviewer guide me when I was stuck. We solved a graph problem and starting with the brute force helped identify optimization opportunities.",
          timestamp: "2024-03-18T21:15:00",
          likes: 12,
          isAccepted: false
        },
        {
          id: 403,
          author: "AlgorithmNewbie",
          authorAvatar: "AN",
          content: "Can you share what kind of graph problem it was? I'm preparing for interviews too and would love to practice similar questions!",
          timestamp: "2024-03-18T21:30:00",
          likes: 8,
          isAccepted: false
        },
        {
          id: 404,
          author: "InterviewPrep",
          authorAvatar: "IP",
          content: "It was a variation of the shortest path problem with some constraints. Very similar to leetcode medium 'Network Delay Time'. Key was to use Dijkstra's algorithm!",
          timestamp: "2024-03-18T21:45:00",
          likes: 15,
          isAccepted: false
        }
      ],
      views: 567
    }
  ];

// Tags Component
const Tags = ({ selectedTags, onTagClick, className }) => {
  const tags = [
    { name: 'algorithms', color: 'primary' },
    { name: 'data-structures', color: 'secondary' },
    { name: 'dynamic-programming', color: 'success' },
    { name: 'optimization', color: 'danger' },
    { name: 'interview-prep', color: 'warning' },
    { name: 'system-design', color: 'info' },
    { name: 'best-practices', color: 'dark' }
  ];

  return (
    <div className={`d-flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <MDBBadge
          key={tag.name}
          color={tag.color}
          className={`tag-badge ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => onTagClick(tag.name)}
        >
          {tag.name}
        </MDBBadge>
      ))}
    </div>
  );
};

// Stats Card Component
const StatsCard = () => (
  <MDBCard>
    <MDBCardBody>
      <h5 className="mb-3">Quick Stats</h5>
      <div className="stats-container">
        <div className="stat-item">
          <MDBIcon fas icon="users" className="me-2" />
          <span>1.2K Users Online</span>
        </div>
        <div className="stat-item">
          <MDBIcon fas icon="comments" className="me-2" />
          <span>5.8K Discussions</span>
        </div>
        <div className="stat-item">
          <MDBIcon fas icon="reply" className="me-2" />
          <span>15.3K Replies</span>
        </div>
      </div>
    </MDBCardBody>
  </MDBCard>
);

// Discussion Reply Component
const DiscussionReply = ({ reply }) => (
  <div className="reply-card mb-3 p-3">
    <div className="d-flex">
      <div className="avatar-circle me-2">{reply.authorAvatar}</div>
      <div className="w-100">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="mb-0">{reply.author}</h6>
            <small className="text-muted">
              {new Date(reply.timestamp).toLocaleDateString()}
            </small>
          </div>
          {reply.isAccepted && (
            <MDBBadge color="success" className="ms-2">
              <MDBIcon fas icon="check" className="me-1" /> Accepted
            </MDBBadge>
          )}
        </div>
        <div className="reply-content">
          <ReactMarkdown>{reply.content}</ReactMarkdown>
        </div>
        <div className="reply-actions mt-2">
          <button className="action-button">
            <MDBIcon far icon="heart" className="me-1" />
            {reply.likes}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Discussion Card Component
const DiscussionCard = ({ discussion, tags }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { currentUser } = useAuth();

  const handleReply = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      // Add reply logic here
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };
  

  return (
    <MDBCard className="mb-3 discussion-card">
      <MDBCardBody>
        {/* Main Post Content */}
        <div className="d-flex align-items-start mb-3">
          <div className="avatar-circle me-3">{discussion.authorAvatar}</div>
          <div className="w-100">
            <MDBTypography tag="h5" className="mb-1">
              {discussion.title}
            </MDBTypography>
            <p className="text-muted small mb-2">
              Posted by {discussion.author} •{' '}
              {new Date(discussion.timestamp).toLocaleDateString()}
            </p>
            <div className="discussion-content mb-3">
              <ReactMarkdown>{discussion.content}</ReactMarkdown>
            </div>
            <div className="d-flex gap-2 mb-3">
              {discussion.tags.map((tag) => (
                <MDBBadge
                  key={tag}
                  color={tags.find(t => t.name === tag)?.color || 'primary'}
                  className="tag-badge"
                >
                  {tag}
                </MDBBadge>
              ))}
            </div>
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="discussion-actions mb-3">
          <button className="action-button">
            <MDBIcon fas icon="heart" className={discussion.liked ? 'text-danger' : ''} />
            <span className="ms-1">{discussion.likes}</span>
          </button>
          <button className="action-button" onClick={() => setShowReplies(!showReplies)}>
            <MDBIcon fas icon="comment" />
            <span className="ms-1">{discussion.replies.length}</span>
          </button>
          <button className="action-button">
            <MDBIcon fas icon="eye" />
            <span className="ms-1">{discussion.views}</span>
          </button>
          <button className="action-button">
            <MDBIcon fas icon="bookmark" />
            <span className="ms-1">Save</span>
          </button>
          <button className="action-button" onClick={() => setShowReplyForm(!showReplyForm)}>
            <MDBIcon fas icon="reply" />
            <span className="ms-1">Reply</span>
          </button>
        </div>

        {/* Replies Section */}
        {showReplies && (
          <div className="replies-section pl-4">
            {discussion.replies.map((reply) => (
              <DiscussionReply key={reply.id} reply={reply} />
            ))}
          </div>
        )}

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReply} className="reply-form mt-3">
            <MDBTextArea
              label="Your reply"
              rows={4}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="mb-2"
            />
            <div className="d-flex gap-2">
              <MDBBtn type="submit" size="sm">Post Reply</MDBBtn>
              <MDBBtn 
                color="light" 
                size="sm"
                onClick={() => setShowReplyForm(false)}
              >
                Cancel
              </MDBBtn>
            </div>
          </form>
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

// Main DiscussionForum Component
const DiscussionForum = () => {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [discussions, setDiscussions] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTabClick = (tab) => setActiveTab(tab);

  const tags = [
    { name: 'algorithms', color: 'primary' },
    { name: 'data-structures', color: 'secondary' },
    { name: 'dynamic-programming', color: 'success' },
    { name: 'optimization', color: 'danger' },
    { name: 'interview-prep', color: 'warning' },
    { name: 'system-design', color: 'info' },
    { name: 'best-practices', color: 'dark' }
  ];
  
  const handleTagClick = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const postData = {
        ...newPost,
        author: `${userProfile?.firstName} ${userProfile?.lastName}` || currentUser.email,
        authorAvatar: (userProfile?.firstName?.[0] + userProfile?.lastName?.[0])?.toUpperCase() || 'U',
        authorId: currentUser.uid,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: [],
        views: 0
      };

      await addDoc(collection(db, 'discussions'), postData);
      setNewPost({ title: '', content: '', tags: [] });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const filterDiscussions = () => {
    let filtered = mockDiscussions;

    if (searchTerm) {
      filtered = filtered.filter(discussion =>
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(discussion =>
        discussion.tags.some(tag => selectedTags.includes(tag))
      );
    }

    switch (activeTab) {
      case 'popular':
        return filtered.sort((a, b) => b.likes - a.likes);
      case 'recent':
        return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case 'unanswered':
        return filtered.filter(d => d.replies.length === 0);
      default:
        return filtered;
    }
  };

  return (
    <div className="discussion-page-container min-vh-100 py-4">
      <MDBContainer>
        <MDBRow>
          {/* Left Sidebar */}
          <MDBCol md="3">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <h5 className="mb-3">Popular Tags</h5>
                <Tags selectedTags={selectedTags} onTagClick={handleTagClick} />
              </MDBCardBody>
            </MDBCard>
            <StatsCard />
          </MDBCol>

          {/* Main Content */}
          <MDBCol md="9">
            {/* Search and Create */}
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow className="align-items-center">
                  <MDBCol md="8">
                    <MDBInput
                      label="Search discussions"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      icon="search"
                    />
                  </MDBCol>
                  <MDBCol md="4" className="text-end">
                    <MDBBtn 
                      color="primary"
                      className="create-post-btn"
                      onClick={() => document.getElementById('createPostForm').scrollIntoView({ behavior: 'smooth' })}
                    >
                      <MDBIcon fas icon="plus" className="me-2" />
                      Create Post
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>

            {/* Tabs */}
            <MDBTabs className="mb-4">
              {['all', 'popular', 'recent', 'unanswered'].map((tab) => (
                <MDBTabsItem key={tab}>
                  <MDBTabsLink 
                    onClick={() => handleTabClick(tab)} 
                    active={activeTab === tab}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </MDBTabsLink>
                </MDBTabsItem>
              ))}
            </MDBTabs>

            {/* Discussions List */}
            <MDBTabsContent>
              <MDBTabsPane show={true}>
                {filterDiscussions().map((discussion) => (
                  <DiscussionCard 
                    key={discussion.id} 
                    discussion={discussion}
                    tags={tags}
                  />
                ))}
              </MDBTabsPane>
            </MDBTabsContent>

            {/* Create Post Form */}
            <MDBCard className="mt-4" id="createPostForm">
              <MDBCardBody>
                <h5 className="mb-4">Create New Discussion</h5>
                <form onSubmit={handleCreatePost}>
                  <MDBInput
                    label="Title"
                    className="mb-4"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    required
                  />
                  <MDBTextArea
                    label="Content (Markdown supported)"
                    rows={6}
                    className="mb-4"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    required
                  />
                  <div className="mb-4">
                    <label className="form-label">Select Tags</label>
                    <Tags
                      selectedTags={newPost.tags}
                      onTagClick={(tag) => {
                        const updatedTags = newPost.tags.includes(tag)
                          ? newPost.tags.filter(t => t !== tag)
                          : [...newPost.tags, tag];
                        setNewPost({...newPost, tags: updatedTags});
                      }}
                    />
                  </div>
                  <MDBBtn type="submit" className="w-100">
                    Create Discussion
                  </MDBBtn>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default DiscussionForum;