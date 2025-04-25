/**
 *  THis is a video page onclicking on video this video page will open and starts streaming
 */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
// importing the icons
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// importing components
import Comments from "../components/Comments";
// import Card from "../components/Card";
import Recommendation from "../components/Recommendation";
// redux
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
// import axios from "axios";
import { axiosInstance } from "..//config";

const Container = styled.div`
  display: flex;
  gap: 24px;
  padding: 24px;
  height: calc(100vh - 56px);
  overflow-y: auto;
`;

const Content = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
`;

const VideoFrame = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
  font-size: 14px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.soft};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.softHover};
  }

  svg {
    font-size: 20px;
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius: 12px;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${({ theme }) => theme.soft};
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 600;
  font-size: 16px;
`;

const ChannelCounter = styled.span`
  color: ${({ theme }) => theme.textSoft};
  font-size: 13px;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
  white-space: pre-wrap;
`;

const Subscribe = styled.button`
  background-color: ${({ subscribed }) => (subscribed ? "#666" : "#cc1a00")};
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 24px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const [channel, setChannel] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const videoRes = await axiosInstance.get(`/videos/find/${path}`);
        const channelRes = await axiosInstance.get(`/users/find/${videoRes.data.userId}`);
        
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
        
        // Update view count
        await axiosInstance.put(`/videos/view/${path}`);
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      await axiosInstance.put(`/users/like/${currentVideo._id}`);
      dispatch(like(currentUser._id));
    } catch (err) {
      console.error("Error liking video:", err);
    }
  };

  const handleDislike = async () => {
    if (!currentUser) return;
    try {
      await axiosInstance.put(`/users/dislike/${currentVideo._id}`);
      dispatch(dislike(currentUser._id));
    } catch (err) {
      console.error("Error disliking video:", err);
    }
  };

  const handleSub = async () => {
    if (!currentUser) return;
    try {
      if (currentUser.subscribedUsers.includes(channel._id)) {
        await axiosInstance.put(`/users/unsub/${channel._id}`);
      } else {
        await axiosInstance.put(`/users/sub/${channel._id}`);
      }
      dispatch(subscription(channel._id));
    } catch (err) {
      console.error("Error updating subscription:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo?.videoUrl} controls />
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>
            {currentVideo?.views.toLocaleString()} views • {format(currentVideo?.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo?.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {currentVideo?.likes?.length.toLocaleString()}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo?.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}
            </Button>
            <Button>
              <ReplyOutlinedIcon />
              Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon />
              Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>
                {channel.subscribers?.toLocaleString()} subscribers
              </ChannelCounter>
              <Description>{currentVideo?.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe
            onClick={handleSub}
            subscribed={currentUser?.subscribedUsers?.includes(channel._id)}
          >
            {currentUser?.subscribedUsers?.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo?._id} />
      </Content>
      <Recommendation tags={currentVideo?.tags} />
    </Container>
  );
};

export default Video;
