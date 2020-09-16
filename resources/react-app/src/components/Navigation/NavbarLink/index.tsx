import React from 'react';
import { FaArrowLeft, FaCog } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';

const NavbarLink = ({
  className,
  label,
  light,
  path,
}: Props.NavbarLinkProps) => {
  const location = useLocation().pathname;
  const isActive = location === path;
  console.log(location, path, isActive);

  const switchLabel = (string: string) => {
    if (string === 'arrow-left') return <FaArrowLeft />;
    if (string === 'cog') return <FaCog />;
    return string;
  };

  return (
    <NavItem className={className}>
      <NavLink active={isActive} disabled={isActive} to={path} tag={Link}>
        <span
          className={
            'nav-link-inner--text' + (isActive ? ' text-white-50' : '')
          }
        >
          {switchLabel(label)}
        </span>
      </NavLink>
    </NavItem>
  );
};

export default NavbarLink;
