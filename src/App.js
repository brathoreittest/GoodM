import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

function App() {
  const [videoIds, setVideoIds] = useState([]);
  const [profileVideoIds, setProfileVideoIds] = useState([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [playing, setPlaying] = useState(false); // State to control autoplay
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null); // Index for previous/next navigation
  const [profileIndex, setProfileIndex] = useState(1); // Index for profile videos, start from 1
  const [usingProfileVideos, setUsingProfileVideos] = useState(false); // Flag to track if using profile videos
  const playerRef = useRef(null);

  useEffect(() => {
    if (!usingProfileVideos) {
      // Fetch the video IDs from videos1.txt
      fetch('https://raw.githubusercontent.com/brathoreittest/GoodM/main/src/videos1.txt')
        .then(response => response.text())
        .then(text => {
          const ids = text.split('\n').filter(id => id.trim() !== '');
          setVideoIds(ids);

          // Play a random video initially
          if (ids.length > 0) {
            const randomIndex = Math.floor(Math.random() * ids.length);
            setCurrentVideoUrl(`https://www.youtube.com/watch?v=${ids[randomIndex]}`);
            setCurrentVideoIndex(randomIndex); // Set initial index
            setPlaying(true); // Start playing the initial video
          }
        })
        .catch(error => console.error('Error loading videos1.txt:', error));
    }
  }, [usingProfileVideos]);

  useEffect(() => {
    // Fetch profile videos based on profileIndex
    if (usingProfileVideos) {
      fetch(`https://raw.githubusercontent.com/brathoreittest/GoodM/main/src/videos${profileIndex}.txt`)
        .then(response => response.text())
        .then(text => {
          const ids = text.split('\n').filter(id => id.trim() !== '');
          setProfileVideoIds(ids);
        })
        .catch(error => console.error(`Error loading videos${profileIndex}.txt:`, error));
    }
  }, [profileIndex, usingProfileVideos]);

  const handlePrevious = () => {
    if (!usingProfileVideos && videoIds.length > 0 && currentVideoIndex !== null) {
      const previousIndex = (currentVideoIndex - 1 + videoIds.length) % videoIds.length;
      const previousVideoUrl = `https://www.youtube.com/watch?v=${videoIds[previousIndex]}`;
      setCurrentVideoUrl(previousVideoUrl);
      setCurrentVideoIndex(previousIndex);
      setPlaying(true); // Autoplay the previous video
    }
  };

  const handleNext = () => {
    if (usingProfileVideos && profileVideoIds.length > 0) {
      // Continue with the current profile video list
      const randomIndex = Math.floor(Math.random() * profileVideoIds.length);
      const randomVideoUrl = `https://www.youtube.com/watch?v=${profileVideoIds[randomIndex]}`;
      setCurrentVideoUrl(randomVideoUrl);
      setPlaying(true); // Autoplay the next video from the profile list
    } else if (!usingProfileVideos && videoIds.length > 0) {
      // Switch to profile videos
      setUsingProfileVideos(true);
      const randomIndex = Math.floor(Math.random() * videoIds.length);
      const randomVideoUrl = `https://www.youtube.com/watch?v=${videoIds[randomIndex]}`;
      setCurrentVideoUrl(randomVideoUrl);
      setCurrentVideoIndex(randomIndex); // Set new index for main video list
      setPlaying(true); // Autoplay the next video from main list
    }
  };

  const handleProfile = () => {
    if (profileVideoIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * profileVideoIds.length);
      const randomVideoUrl = `https://www.youtube.com/watch?v=${profileVideoIds[randomIndex]}`;
      setCurrentVideoUrl(randomVideoUrl);
      setPlaying(true); // Autoplay the random profile video

      // Move to the next profile file
      setProfileIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % 5; // Limit profile index to 1-4
        return nextIndex === 0 ? 1 : nextIndex; // Skip index 0 and reset to 1
      });

      // Set flag to indicate we're using profile videos
      setUsingProfileVideos(true);
    }
  };

  const handleReady = () => {
    const duration = playerRef.current.getDuration();
    if (duration) {
      const randomTime = Math.floor(Math.random() * duration);
      playerRef.current.seekTo(randomTime);
    }
  };

  return (
    <div className="App">
      {currentVideoUrl && (
        <div className="player-wrapper">
          <ReactPlayer
            ref={playerRef}
            url={currentVideoUrl}
            playing={playing}
            onReady={handleReady}
            width="100%"
            height="100%"
          />
          {/*<button className="previous-button" onClick={handlePrevious}>Previous</button>*/}
          <button className="next-button" onClick={handleNext}>Next</button>
          <button className="profile-button" onClick={handleProfile}>Profile</button>
        </div>
      )}
    </div>
  );
}

export default App;
