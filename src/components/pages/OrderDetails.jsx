import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/apiClient";
import CancelOrderModal from "./CancelOrderModal";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);

  /* -------------------------------------------
      FETCH ORDER DETAILS
  -------------------------------------------- */
  const loadOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error("Failed to load order:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (loading) return <div className="pt-28 p-6">Loading order…</div>;
  if (!order) return <div className="pt-28 p-6">Order not found</div>;

  /* -------------------------------------------
      CUSTOMER CAN CANCEL ONLY IF:
      status = Ordered | Packed | Shipped
  -------------------------------------------- */
  const cancellableStatuses = ["Ordered", "Packed", "Shipped"];
  const canCancel = cancellableStatuses.includes(order.status);

  return (
    <div className="container mx-auto px-6 py-10 pt-28">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="text-sm text-gray-500">Order ID</div>
        <div className="font-semibold mb-4">{order._id}</div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Shipping */}
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && (
              <p>{order.shippingAddress.address2}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-medium mb-2">Payment</h3>
            <p>Method: {order.paymentMethod}</p>
            <p>Status: {order.paymentStatus}</p>
            {order.paidAt && (
              <p>Paid at: {new Date(order.paidAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">Items</h3>

        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4 border-b pb-3">
              <img
                src={item.image}
                className="w-20 h-20 object-cover rounded"
                alt={item.name}
              />

              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                {item.selectedSize?.label && (
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {item.selectedSize.label}
                  </p>
                )}
              </div>

              <div className="font-semibold">₹{item.price}</div>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <div className="text-right font-semibold text-lg">
          Total: ₹{order.totalPrice}
        </div>
      </div>

      {/* CANCEL ORDER BUTTON */}
      {canCancel && (
        <button
          onClick={() => setShowCancel(true)}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cancel Order
        </button>
      )}

      {/* MODAL */}
      {showCancel && (
        <CancelOrderModal
          order={order}
          onClose={() => setShowCancel(false)}
          onUpdated={loadOrder}
        />
      )}
    </div>
  );
}