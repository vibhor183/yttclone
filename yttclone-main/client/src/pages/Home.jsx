import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
import { axiosInstance } from "../config";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const VideoGrid = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 0;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 0px;
  }
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme, active }) =>
    active ? theme.soft : theme.bgLighter};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    "All",
    "Music",
    "Gaming",
    "Education",
    "Sports",
    "Comedy",
    "Entertainment",
    "News",
    "Tech",
    "Vlogs"
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get(`/videos/${type}`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [type]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter.toLowerCase());
    // TODO: Implement filter functionality with backend
  };

  return (
    <Container>
      <FilterContainer>
        {filters.map((filter) => (
          <FilterButton
            key={filter}
            active={activeFilter === filter.toLowerCase()}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </FilterButton>
        ))}
      </FilterContainer>
      <VideoGrid>
        {videos.map((video) => (
          <Card key={video._id} video={video} />
        ))}
      </VideoGrid>
    </Container>
  );
};

export default Home;
