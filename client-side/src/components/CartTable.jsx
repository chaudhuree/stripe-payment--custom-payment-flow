import React from "react";

export default function CartTable({ cartItems }) {
  return (
    <>
      <section className="pt-5 mt-5 w-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card">
                <div className="table-responsive">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Image / Name
                        </th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                          Brand
                        </th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Description
                        </th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Price
                        </th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr>
                          <td>
                            <div className="d-flex px-2 py-1">
                              <div>
                                <img
                                  width={48}
                                  src={item.image}
                                  className="avatar avatar-sm me-3"
                                />
                              </div>
                              <div className="d-flex flex-column justify-content-center">
                                <h6 className="mb-0 text-xs">
                                  {item.name}
                                </h6>
                              </div>
                            </div>
                          </td>

                          <td className="align-middle  text-sm">
                            {item.brand}
                          </td>

                          <td className="align-middle text-center text-sm">
                            {item.desc}
                          </td>
                          <td className="align-middle text-center">
                            <span className="text-secondary text-xs font-weight-bold">
                              ${item.price}
                            </span>
                          </td>
                          <td className="align-middle text-center">
                            <span className="text-secondary text-xs font-weight-bold">
                              {item.cartQuantity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
