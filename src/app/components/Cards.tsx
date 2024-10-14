import React from "react";
import Card from "./Card";
import { useState } from "react";
import { useEffect } from "react";
import { Category } from "@prisma/client";
import { CircularProgress } from "@mui/material";

const Cards = () => {
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState<Category[]>([]);
  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCardData(data);
    console.log(data);
    setLoading(false);
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  return loading ? (
    <div className="flex h-full w-full items-center justify-center text-primary">
      <CircularProgress color="inherit" />
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 w-full ">
      {cardData.map((card, index) => (
        <Card key={index} title={card.name} description={card.description} />
      ))}
    </div>
  );
};

export default Cards;
