import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import "../css/Contact.css";

const Contact = () => {
  return (
    <div className="contact-container mt-5">
      <div className="container">
        {/* Top Info Section */}
        <div className="row text-center mb-5">
          <div className="col-md-4">
            <FaMapMarkerAlt size={36} className="mb-3" />
            <h5 className="fw-bold">Address:</h5>

            <p className="mb-1">SAwARGAON, Samruddhi Collection</p>
            <p>PINCODE: 412401</p>
          </div>
          <div className="col-md-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d942.3621650220839!2d73.89958215311131!3d19.13182834491904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdd3900281cbd47%3A0x723b5ce3073778a7!2sSamruddhi%20Collection%20Sawargaon!5e0!3m2!1sen!2sin!4v1759846482214!5m2!1sen!2sin"
              width="100%"
              height="200"
              style={{ border: 0, borderRadius: "8px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Samruddhi Collection Location"
            ></iframe>
          </div>
          <div className="col-md-4 mt-2">
            <FaPhone size={36} className="mb-3" />
            <h5 className="fw-bold">Contact us:</h5>
            <p>
              Email us for general queries, including marketing and partnership
              opportunities.
            </p>
            <a href="mailto:hello@flowbite.com" className="contact-email">
              Samruddhi2024@gmail..com
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form className="contact-form">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">First name</label>
              <input type="text" className="form-control" placeholder="" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last name</label>
              <input type="text" className="form-control" placeholder="" />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Your email</label>
              <input
                type="email"
                className="form-control"
                placeholder="your@gmail.com"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone number</label>
              <input
                type="text"
                className="form-control"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Your message</label>
            <textarea className="form-control" rows={4}></textarea>
          </div>

          

          <div className="text-start">
            <button type="button" className="contact-btn">
              Send message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
