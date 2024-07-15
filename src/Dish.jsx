import React from 'react';

const Dish = ({ dish, onToggle }) => {
  return (
    <div className="dish">
      <img src={dish.imageUrl} alt={dish.dishName} className="dish-image" />
      <h2>{dish.dishName}</h2>
      <button onClick={() => onToggle(dish.dishId)}>
        {dish.isPublished ? 'Unpublish' : 'Publish'}
      </button>
    </div>
  );
};

export default Dish;
