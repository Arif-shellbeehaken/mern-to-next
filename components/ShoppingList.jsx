import React, { useState } from "react";
import { Container, ListGroup, ListGroupItem, Button, Table } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ItemData from "../constaint/data.json";
import Image from "next/image";
import { BsFillTrashFill, BsWrench } from "react-icons/bs";
import { useSelector } from "react-redux";

import {
  useGetItemsQuery,
  selectAllItems,
  useDeleteItemMutation,
} from "../redux/slice/itemSlice";
import { useNavigate } from "react-router-dom";
import UpdateItemModal from "./UpdateItemModal";

const ShoppingList = ({ users }) => {
  const navigate = useNavigate();
  const [updateModal, setUpdatedModal] = useState(false);
  const { isLoading, isSuccess, isError, error } = useGetItemsQuery();

  // const orderedPostIds = useSelector(selectPostIds)
  const data2 = useSelector(selectAllItems);
  const [deleteItem] = useDeleteItemMutation();

  console.log(data2);
  const items2 = ItemData;
  const isAuthenticated = true;

  const handleDelete = async (id) => {
    try {
      await deleteItem({ id });
    } catch (err) {
      console.error("Failed to delete the post", err);
    }
    navigate("/", { replace: true });
  };
  return (
    <Container>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            {/* <th>Image</th> */}
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data2[0]?.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              {/* <td>
                <Image src={item.image} alt="" width={40} height={40} />
              </td> */}
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>
                <Button
                  className="remove-btn"
                  color="danger"
                  size="sm"
                  onClick={() => handleDelete(item._id)}
                >
                  <BsFillTrashFill />
                </Button>{" "}
                <Button
                  className="edit-btn "
                  color="info"
                  size="sm"
                  onClick={() => setUpdatedModal(!updateModal)}
                >
                  <BsWrench />
                </Button>
              </td>
              {updateModal ? <UpdateItemModal item={item} /> : null}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ShoppingList;
