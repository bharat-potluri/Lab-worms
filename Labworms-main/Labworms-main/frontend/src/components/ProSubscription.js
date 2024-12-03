import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBBadge,
  MDBProgress,
  MDBProgressBar
} from 'mdb-react-ui-kit';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import './ProSubscription.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';


const ProSubscription = () => {
  const { currentUser } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [progressData] = useState([
    { month: 'Week 1', problems: 5 },
    { month: 'Week 2', problems: 12 },
    { month: 'Week 3', problems: 18 },
    { month: 'Week 4', problems: 25 },
  ]);
  const apiUrl = "https://leetcode-46562.uc.r.appspot.com";
  // const apiUrl = "http://127.0.0.1:5000";

  useEffect(() => {
    // Check URL parameters
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
    const canceled = query.get('canceled');

    if (sessionId) {
      verifyStripeSession(sessionId);
    } else if (canceled) {
      console.log('Payment was canceled');
    }
  }, [location.search]);

  // Also update the verifyStripeSession function
const verifyStripeSession = async (sessionId) => {
  try {
    setIsProcessing(true);
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const idToken = await currentUser.getIdToken(true);

    const response = await fetch(`${apiUrl}/api/verify-session/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify session');
    }

    const data = await response.json();
    if (data.success) {
      // Update local subscription state
      setSubscriptionData('pro');
      // Redirect to questions page
      navigate('/questionsPage', { replace: true });
    } else {
      throw new Error(data.error || 'Failed to verify session');
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    // Show error to user
  } finally {
    setIsProcessing(false);
  }
};


  useEffect(() => {
    // Check URL parameters for success/failure
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      handlePaymentSuccess();
    }
    if (query.get('canceled')) {
      console.log('Payment was canceled');
      navigate('/subscription', { replace: true });
    }
  }, [location]);

  const handleUpgradeClick = async () => {
    try {
      setIsProcessing(true);
      if (!currentUser) {
        console.error('No user logged in');
        navigate('/login');
        return;
      }
  
      // Get a fresh token
      const idToken = await currentUser.getIdToken(true);
      console.log('Got fresh token:', idToken.substring(0, 10) + '...');
      
      const url = `${apiUrl}/api/create-checkout-session`;
      console.log('Making request to:', url);
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
  
      console.log('Response status:', response.status);
      
      // Try to get response body even if it's an error
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server');
      }
  
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
  
      if (data.success && data.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      // You might want to show this error to the user
    } finally {
      setIsProcessing(false);
    }
  };


  const handlePaymentSuccess = async () => {
    try {
      setIsProcessing(true);
      if (!currentUser) {
        console.error('No user logged in');
        navigate('/login');
        return;
      }
  
      // Get a fresh token
      const idToken = await currentUser.getIdToken(true);
      console.log('Got fresh token for update:', idToken.substring(0, 10) + '...');
  
      const url = `${apiUrl}/api/update-subscription`;
      console.log('Making update request to:', url);
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
  
      console.log('Update response status:', response.status);
      
      // Parse response
      let data;
      try {
        data = await response.json();
        console.log('Update response data:', data);
      } catch (e) {
        console.error('Error parsing update response:', e);
        throw new Error('Invalid response from server');
      }
  
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
  
      if (data.success) {
        // Update local subscription state
        setSubscriptionData('pro');
        console.log('Subscription updated successfully');
        // Redirect to questions page
        navigate('/questionsPage', { replace: true });
      } else {
        throw new Error(data.error || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      // You might want to show this error to the user
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const handleStripeEvent = (event) => {
      if (event.detail.type === 'checkout.session.completed') {
        handlePaymentSuccess();
      }
    };

    window.addEventListener('stripe-buy-button:success', handleStripeEvent);
    return () => {
      window.removeEventListener('stripe-buy-button:success', handleStripeEvent);
    };
  }, []);

  const ProFeatures = () => (
    <div className="features-grid">
      {[
        { icon: '⚡', title: 'Code Execution', desc: 'Run your code against all test cases' },
        { icon: '📊', title: 'Progress Tracking', desc: 'Detailed analytics of your progress' },
        { icon: '🎯', title: 'Advanced Problems', desc: 'Access to exclusive problems' },
        { icon: '🏆', title: 'Contests', desc: 'Participate in premium contests' },
        { icon: '📚', title: 'Solutions', desc: 'Access detailed solution explanations' },
        { icon: '🎓', title: 'Learning Paths', desc: 'Structured learning journeys' },
      ].map((feature, index) => (
        <div key={index} className="feature-card">
          <span className="feature-icon">{feature.icon}</span>
          <h3>{feature.title}</h3>
          <p>{feature.desc}</p>
        </div>
      ))}
    </div>
  );

  const SubscriptionStatus = () => {
    if (!subscriptionData || subscriptionData === 'free') return null;

    return (
      <MDBCard className="subscription-status-card">
        <MDBCardBody>
          <h2 className="text-center mb-4">Your Pro Membership</h2>
          
          <div className="status-grid">
            <div className="status-item">
              <h4>Membership Status</h4>
              <MDBBadge color='success' className='status-badge'>Active</MDBBadge>
            </div>
            
            <div className="status-item">
              <h4>Time Remaining</h4>
              <div className="time-remaining">
                <MDBProgress height='20'>
                  <MDBProgressBar width={75} valuemin={0} valuemax={100}>
                    9 months left
                  </MDBProgressBar>
                </MDBProgress>
              </div>
            </div>

            <div className="status-item">
              <h4>Problems Solved Since Pro</h4>
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="problems" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </MDBCardBody>
      </MDBCard>
    );
  };

  return (
    <div className="pro-page-container">
      <div className="pro-hero-section">
        <h1>Elevate Your Coding Journey</h1>
        <p>Unlock your full potential with Pro access</p>
      </div>

      <MDBContainer className="py-5">
        <SubscriptionStatus />

        <MDBRow className="justify-content-center">
          <MDBCol md="10" lg="8">
            <MDBCard className="pricing-card">
              <MDBCardBody className="text-center">
                <div className="pricing-header">
                  <h2>Pro Membership</h2>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">19</span>
                    <span className="period">/month</span>
                  </div>
                </div>

                <div className="divider">
                  <span>Everything in Free, plus:</span>
                </div>

                <ul className="feature-list">
                  <li>
                    <MDBIcon fas icon="check" className="text-success" />
                    Code Execution with Test Cases
                  </li>
                  <li>
                    <MDBIcon fas icon="check" className="text-success" />
                    Advanced Analytics & Progress Tracking
                  </li>
                  <li>
                    <MDBIcon fas icon="check" className="text-success" />
                    Premium Problems & Solutions
                  </li>
                  <li>
                    <MDBIcon fas icon="check" className="text-success" />
                    Interview Preparation Resources
                  </li>
                  <li>
                    <MDBIcon fas icon="check" className="text-success" />
                    Premium Contests Access
                  </li>
                </ul>

                <MDBBtn 
        color='primary' 
        className='upgrade-btn'
        disabled={subscriptionData === 'pro' || isProcessing}
        onClick={handleUpgradeClick}
      >
        {isProcessing ? (
          <span>
            <MDBIcon fas icon="spinner" spin /> Processing...
          </span>
        ) : subscriptionData === 'pro' ? (
          'Currently Pro'
        ) : (
          'Upgrade to Pro'
        )}
      </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        <section className="features-section">
          <h2 className="text-center mb-5">What's Included in Pro</h2>
          <ProFeatures />
        </section>
      </MDBContainer>
    </div>
  );
};

export default ProSubscription;