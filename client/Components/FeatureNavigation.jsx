import React from 'react';
import { stack as Menu } from 'react-burger-menu';
import { Link } from 'react-router';
import Radium from 'radium';

let RadiumLink = Radium(Link);
class FeatureNavigation extends React.Component {
  render() {
    return (
      <Menu>
        <RadiumLink className="home" to="/home">Home</RadiumLink>
        <RadiumLink className="wtb" to="/wtb">What To Bring</RadiumLink>
        <RadiumLink className="transportation" to="/transportation">Transportation</RadiumLink>
        <RadiumLink className="reminders" to="/reminders">Reminders</RadiumLink>
      </Menu>
    );
  }
};

export default FeatureNavigation;