import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
            alert(`Message sent by ${formData.name}`);
              };

                return (
                    <form onSubmit={handleSubmit}>
                          <input 
                                  placeholder="Name" 
                                          onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                                />
                                                      <textarea 
                                                              placeholder="Message" 
                                                                      onChange={(e) => setFormData({...formData, message: e.target.value})} 
                                                                            />
                                                                                  <button type="submit">Submit</button>
                                                                                      </form>
                                                                                        );
                                                                                        }