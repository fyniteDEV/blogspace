// LOGIN
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("jwt", data.access_token);
            window.location.href = "/";
        }
        else {
            document.getElementById("infoMessage").textContent = data.message;
        }        
    } catch (error) {
        document.getElementById("infoMessage").textContent = "Server currently unreachable. Please try again later.";
    }
}

// REGISTRATION
async function register(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, username, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById("infoMessage").style.color = "darkgreen";
            document.getElementById("infoMessage").textContent = "Successfully registered. Redirecting to login page..."
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        } else {
            document.getElementById("infoMessage").textContent = data.message;
        }
    } catch (error) {
        document.getElementById("infoMessage").textContent = "Server currently unreachable. Please try again later.";
    }
}

// LOGOUT
async function logout(event) {
    event.preventDefault();
    const token = localStorage.getItem("jwt");

    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            },
        });
    } catch (error) {
        console.error(error);
        console.error("could not make POST request");
    }

    localStorage.removeItem("jwt");
    window.location.href = event.target.href;
}

// POST COMMENT 
async function postComment() {
    const token = localStorage.getItem("jwt");
    const content = document.getElementById("comment-content").value;
    const slug = window.location.pathname.split("/")[2];
 
    try {
        const response = await fetch("/api/new-comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body: JSON.stringify({ content, slug })
        });

        if (response.status === 200) {
            document.getElementById("comment-content").value = "";
            loadComments();
        } else {
            window.alert(response.message);
        }
        // console.log(response);

    } catch (error) {
        console.error(error);
        console.error("could not make POST request");
    }
}

// Load comments on page load
let ignoreMutations = false;
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === "childList" && !ignoreMutations) {
            loadComments();
            console.log("Comments loaded");
        }
    });
});
const contentDiv = document.getElementById("content");
observer.observe(contentDiv, { childList: true, subtree: true });


async function loadComments() {
    const slug = window.location.pathname.split("/")[2];

    try {
        // Load comments
        const response = await fetch(`/api/blog/${slug}/comments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const comments = await response.json();

        // Add comments
        ignoreMutations = true;
        document.getElementById("all-comments-container").innerHTML = "";
        // const loadedComments = document.getElementById("all-comments-container").children;
        // loadedComments.forEach((comment) => {
        //     document.getElementById("all-comments-container").removeChild(comment);
        // })

        comments.forEach((comment) => {
            // Comment div
            const commentDiv = document.createElement("div");
            commentDiv.className = "comment";
            
            // Comment data
            const commentUsername = document.createElement("p");
            const createdAt = new Date(comment.created_at);
            const dateStr = `${String(createdAt.getDate()).padStart(2, '0')}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${createdAt.getFullYear()}`;
            commentUsername.className = "comment-username";
            commentUsername.innerHTML = `${comment.username} - ${dateStr}`;
            commentDiv.appendChild(commentUsername);
            
            const commentContent = document.createElement("p");
            commentContent.className = "comment-content";
            commentContent.innerHTML = comment.content;
            commentDiv.appendChild(commentContent);
            
            // Comments container
            document.getElementById("all-comments-container").appendChild(commentDiv);
        });

        // ignoreMutations = false;
    } catch (error) {
        console.error(error);
        console.error("could not make GET request");
    }
}