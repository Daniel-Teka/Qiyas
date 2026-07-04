function Contact() {
  return (
    <section className="featured">
      <h2>Contact Us</h2>

      <form className="contact-form">
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <textarea placeholder="Message"></textarea>

        <button type="submit">Send</button>
      </form>
    </section>
  );
}

export default Contact;