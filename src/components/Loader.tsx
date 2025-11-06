import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader3">
        <div className="circle1" />
        <div className="circle1" />
        <div className="circle1" />
        <div className="circle1" />
        <div className="circle1" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader3 {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .circle1 {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 0 10px;
    background-color: #333;
    animation: circle1 1s ease-in-out infinite;
  }

  .circle1:nth-child(2) {
    animation-delay: 0.2s;
  }

  .circle1:nth-child(3) {
    animation-delay: 0.4s;
  }

  .circle1:nth-child(4) {
    animation-delay: 0.6s;
  }

  .circle1:nth-child(5) {
    animation-delay: 0.8s;
  }

  @keyframes circle1 {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }`;

export default Loader;
