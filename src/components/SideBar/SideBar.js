import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { isUserAdmin } from "../../utils/Api";
import BasicModal from "../../components/Modal/BasicModal";

import "./SideBar.scss";

function SideBar(props) {
  const { user, location } = props;
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [userAdmin, setUserAdmin] = useState(false);

  console.log(userAdmin);

  useEffect(() => {
    isUserAdmin(user.uid).then((response) => {
      setUserAdmin(response);
    });
  }, [user]);

  const handlerMenu = (event, menu) => {
    setActiveMenu(menu.to);
  };

  return (
    <>
      <Menu className="menu-left" vertical>
        <div className="top">
          <Menu.Item
            as={Link}
            to="/"
            active={activeMenu === "/"}
            onClick={handlerMenu}
          >
            <Icon name="home" /> Home
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/artists"
            active={activeMenu === "/artists"}
            onClick={handlerMenu}
          >
            <Icon name="music" /> Artists
          </Menu.Item>
        </div>
        {userAdmin && (
          <div className="footer">
            <Menu.Item>
              <Icon name="plus square outline" /> New Artist
            </Menu.Item>
            <Menu.Item>
              <Icon name="plus square outline" /> New Song
            </Menu.Item>
          </div>
        )}
      </Menu>
      <BasicModal show={true} setShow={null} title="Test Title">
        <h2>Modal content</h2>
      </BasicModal>
    </>
  );
}

export default withRouter(SideBar);
