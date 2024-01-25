"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setAllPosts(data);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchText) => {
    const regex = RegExp(searchText, "i");
    return allPosts.filter(
      (post) =>
        regex.test(post.creator.username) ||
        regex.test(post.prompt) ||
        regex.test(post.tag)
    );
  };
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    //debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchedResults = filterPrompts(e.target.value);
        setSearchResults(searchedResults);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchedResults = filterPrompts(tagName);
    setSearchResults(searchedResults);
  };
  return (
    <section className="feed">
      <form className="relative w-full flex-centr">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          required
          onChange={handleSearchChange}
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList data={searchResults} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
