import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dish from './Dish';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Dashboard = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    // Fetch initial dishes from API
    axios.get('http://localhost:8080/api/dishes')
      .then(response => setDishes(response.data))
      .catch(error => console.error('Error fetching dishes:', error));

    // Setup WebSocket connection
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/dishes', (message) => {
        const updatedDish = JSON.parse(message.body);
        setDishes((prevDishes) => 
          prevDishes.map(dish => dish.dishId === updatedDish.dishId ? updatedDish : dish)
        );
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const toggleDishStatus = (id) => {
    axios.post(`http://localhost:8080/api/dishes/${id}/toggle`)
      .then(response => {
        // Update local state
        setDishes(dishes.map(dish =>
          dish.dishId === id ? response.data : dish
        ));
      })
      .catch(error => console.error('Error toggling dish status:', error));
  };

  return (
    <div className="dashboard">
      {dishes.map(dish => (
        <Dish key={dish.dishId} dish={dish} onToggle={toggleDishStatus} />
      ))}
    </div>
  );
};

export default Dashboard;
