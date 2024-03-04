import { useState, useEffect } from "react";
import { BookCard } from "../book-card/book-card";
import { BookView } from "../book-view/book-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Col, Row, Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationBar } from "../navigation-bar/navigation-bar";

export const MainView = () => {
    const [books, setBooks] = useState([]);
    // const [selectedBook, setSelectedBook] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("https://openlibrary.org/search.json?q=star+wars")
            .then((response) => response.json())
            .then((data) => {
                const booksFromApi = data.docs.map((doc) => {
                    return {
                        id: doc.key,
                        title: doc.title,
                        image: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
                        author: doc.author_name?.[0]
                    };
                });

                setBooks(booksFromApi);
            });
    }, []);

    return (
        <Container>
            

            <BrowserRouter>
            <NavigationBar user={user} onLoggedOut={() => setUser(null)} />
                <Row className="justify-content-md-center">
                    <Routes>
                        <Route path="/signup" element={<>{user ? (<Navigate to="/" />) : (<Col md={5}><SignupView /></Col>
                        )}</>
                        }
                        />

                        <Route path="/login" element={<>{user ? (<Navigate to="/" />) : (<Col md={5}><LoginView onLoggedIn={(user) => setUser(user)} />
                        </Col>
                        )}</>
                        }
                        />

                        <Route path="/books/:bookId" element={<>{!user ? (<Navigate to="/login" replace />) : (<Col md={8}><BookView books={books} />
                        </Col>  // navigate to the book view if the user is logged in
                        )}</>
                        }
                        />

                        <Route path="/" element={<>{!user ? (<Navigate to="/login" replace />) : books.length === 0 ? (<Col>The list is empty!</Col>
                        ) : (<>{books.map((book) => (<Col className="mb-4" key={book.id} md={3}><BookCard book={book} />
                        </Col>  // map over the books and create a card for each one, bookcard component renders the book card
                        ))}</>
                        )}</>
                        }
                        />
                    </Routes>
                </Row>
            </BrowserRouter>
        </Container>
    );
};
