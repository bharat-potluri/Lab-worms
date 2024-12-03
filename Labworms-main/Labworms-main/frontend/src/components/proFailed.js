import React from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';
import './proFailed.css';

const SubscriptionStatus = () => {
  // You can change this prop to see different states
  const status = "cancelled"; // possible values: "active", "cancelled", "expired"

  const renderContent = () => {
    switch (status) {
      case "active":
        return (
          <div className="status-content active">
            <MDBIcon fas icon="check-circle" size='3x' className="mb-4" />
            <h2>Your Pro Subscription is Active</h2>
            <p>You have full access to all premium features</p>
            <div className="features-list">
              <div className="feature-item">
                <MDBIcon fas icon="check" /> Premium problem access
              </div>
              <div className="feature-item">
                <MDBIcon fas icon="check" /> Solution explanations
              </div>
              <div className="feature-item">
                <MDBIcon fas icon="check" /> Interview preparation
              </div>
              <div className="feature-item">
                <MDBIcon fas icon="check" /> Ad-free experience
              </div>
            </div>
            <MDBBtn href="/questions" color='primary' className="mt-4">
              Continue Practicing
            </MDBBtn>
          </div>
        );

      case "cancelled":
        return (
          <div className="status-content cancelled">
            <MDBIcon fas icon="times-circle" size='3x' className="mb-4" />
            <h2>Subscription Cancelled</h2>
            <p>Your subscription has been cancelled successfully</p>
            <div className="message-box">
              <p>Your premium access will remain active until the end of your current billing period.</p>
              <p>After that, your account will revert to the free tier.</p>
            </div>
            <MDBBtn href="/pro" color='primary' className="mt-4">
              Reactivate Subscription
            </MDBBtn>
          </div>
        );

      case "expired":
        return (
          <div className="status-content expired">
            <MDBIcon fas icon="exclamation-circle" size='3x' className="mb-4" />
            <h2>Subscription Expired</h2>
            <p>Your premium access has ended</p>
            <div className="features-lost">
              <h5>You no longer have access to:</h5>
              <div className="feature-item">
                <MDBIcon fas icon="lock" /> Premium problems
              </div>
              <div className="feature-item">
                <MDBIcon fas icon="lock" /> Solution explanations
              </div>
              <div className="feature-item">
                <MDBIcon fas icon="lock" /> Interview preparation
              </div>
            </div>
            <MDBBtn href="/pro" color='primary' className="mt-4">
              Upgrade to Pro
            </MDBBtn>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="subscription-status-page">
      <MDBContainer className="py-5">
        <MDBCard className="status-card">
          <MDBCardBody>
            {renderContent()}
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default SubscriptionStatus;