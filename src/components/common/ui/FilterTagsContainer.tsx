"use client";
import * as React from "react";
import { FilterTags } from "./FilterTags";

const defaultTags = [
  "Data Science",
  "IT Certifications",
  "Leadership",
  "Web Development",
  "Communication",
  "Business Analytics & Intelligence"
];

interface FilterTagsContainerProps {
  tags?: string[];
  defaultSelectedTag?: string;
  onTagChange?: (selectedTag: string) => void;
}

export const FilterTagsContainer: React.FC<FilterTagsContainerProps> = ({
  tags = defaultTags,
  defaultSelectedTag = "Data Science",
  onTagChange
}) => {
  const [selectedTag, setSelectedTag] = React.useState<string>(defaultSelectedTag);

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    onTagChange?.(tag);
  };

  return (
    <FilterTags
      tags={tags}
      selectedTag={selectedTag}
      onTagSelect={handleTagSelect}
    />
  );
};

export default FilterTagsContainer;
