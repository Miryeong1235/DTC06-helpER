const favouriteDocRef = db.collection('favorites').doc('user1'); // user1はユーザーIDなどに置き換えてください

// お気に入りの状態を管理する変数
let isFavorite = false;

// お気に入りの状態を切り替える関数
function toggleFavorite() {
    if (isFavorite) {
        removeFromFavorites();
    } else {
        addToFavorites();
    }
}

// お気に入りに追加する関数
function addToFavorites() {
    favouriteDocRef.set({ favorite: true })
        .then(() => {
            console.log("Document successfully written!");
            updateHeartColor(true);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

// Delete from Favorites
function removeFromFavorites() {
    favouriteDocRef.delete()
        .then(() => {
            console.log("Document successfully deleted!");
            updateHeartColor(false);
        })
        .catch((error) => {
            console.error("Error deleting document: ", error);
        });
}

// Change the color 
function updateHeartColor(isFavourited) {
    isFavourite = isFavourited;
    const heartElement = document.getElementById('heart');
    heartElement.innerHTML =
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
        </svg>;
}

// お気に入りの状態を監視し、初期表示を設定
favouriteDocRef.onSnapshot((doc) => {
    const data = doc.data();
    if (data && data.favourite) {
        updateHeartColor(true);
    } else {
        updateHeartColor(false);
    }
});
