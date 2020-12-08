import React, { useState, useEffect } from "react";
import { map } from "lodash";
import Slider from "react-slick";
import firebase from "../../../utils/Firebase";
import "firebase/storage";
import "./BasicSliderItems.scss";
import { Link } from "react-router-dom";

export default function BasicSliderItems(props) {
  const { title, data, folderImage } = props;

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    className: "basic-slider-items__list",
  };

  return (
    <div className="basic-slider-items">
      <h2>{title}</h2>
      <Slider {...settings}>
        {map(data, (item) => (
          <RenderItem key={item.id} item={item} folderImage={folderImage} />
        ))}
      </Slider>
    </div>
  );
}

function RenderItem(props) {
  const { item, folderImage } = props;
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref(`${folderImage}/${item.banner}`)
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      });
  }, [folderImage, item]);

  return (
    <Link to={`/artist/${item.id}`}>
      <div className="basic-slider-items__list-item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${imageUrl})` }}
        />
        <h3>{item.name}</h3>
      </div>
    </Link>
  );
}
