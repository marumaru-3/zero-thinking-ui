<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router'
import {db} from '../firebase'
import {doc, collection, getDocs, deleteDoc, onSnapshot,query,orderBy, where} from 'firebase/firestore'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

const id = ref([])
const clickId = ref("")
const deleteId = ref("")
const modalWindow = ref("")

const dateResult = ref("")
const listObj = ref([])
const dateDevideArr = ref([])

const router = useRouter()
const isLoggedIn = ref(false)

const memoContent = ref("");

// メモを削除
const deleteMenuCss = ref(null)

const getData = async () => {
  const categoryCol = collection(db, "papers");
  // 日付順に並び替え
  const q = query(categoryCol, where('uid', '==', getAuth().currentUser.uid), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  id.value = snapshot.docs.map((doc) => doc.id);
  const docField = snapshot.docs.map((doc) => doc.data());

  listObj.value = [];
  dateDevideArr.value = [];

  
  // 表示用テキスト
   Object.keys(docField).forEach((key) => {
    listObj.value.push({
      title: docField[key].title,
      list: docField[key].list,
      date: docField[key].date,
      docId: id.value[key],
      index: key
    })
  });

  // 日付分け用
  dateResult.value = deleteElement(listObj.value.map((obj) => obj.date))
  dateListDevide()
  // console.log(id.value)

  // console.log(dateDevideArr.value)
}

const delDoc = async (id) => {
  modalWindow.value = "delete";
  deleteId.value = id;
  await deleteDoc(doc(db, "papers", id));
  deleteMenuCss.value = null
}
// 削除するボタンモーダル
const deleteMenuOpen = (id, event) => {
  const mainY = document.querySelector('main').getBoundingClientRect().top
  const clickBtnTop = event.srcElement.getBoundingClientRect().top
  const clickBtnLeft = event.srcElement.getBoundingClientRect().left

  
  const windowWidth = document.documentElement.clientWidth

  deleteMenuCss.value = {
      opacity: 1,
      display: 'block',
      top: clickBtnTop - mainY + 50 + 'px',
      left: 0
  }
  // 削除するボタンが見切れそうな場合
  if (clickBtnLeft + 200 > windowWidth) {
    deleteMenuCss.value.left = clickBtnLeft - 140 + 'px'
  } else {
    deleteMenuCss.value.left = clickBtnLeft + 'px'
  }
  // 削除するメモを指定
  clickId.value = id
}
const deleteMenuClose = () => {
  deleteMenuCss.value = null
}

// メモモーダル
const modalOpen = (id) => {
  modalWindow.value = "open";

  clickId.value = id;

  // モーダルメモの中身を更新
  memoContent.value = listObj.value.filter((obj) => obj.index === clickId.value)[0];
}
const modalClose = () => {
  modalWindow.value = "";
  deleteMenuClose()
}

// メモ入力した日付データの被ってる日付を取り除いて配列にする関数
const deleteElement = (arr) => {
  return arr.filter((value, index) => index === arr.indexOf(value))
}

const dateListDevide = () => {
  dateResult.value.forEach((date) => {
    dateDevideArr.value.push(listObj.value.filter(obj => obj.date === date))
  })
}

const magicGridFunc = (i) => {
  const magicGrid = new MagicGrid({
    container: `.memo-group${i}`,
    animate: true,
    gutter: 10,
    static: true,
    useMin: true,
    maxColumns: 5,
  });
  magicGrid.listen();
}

// ログアウト用
const handleSignOut = () => {
  signOut(auth).then(() => {
    // console.log('ログアウトしました');
    router.push('/about');
  }).catch((error) => {
    console.log(error);
  })
}

let auth;
onMounted(async () => {
  await getData();
  dateResult.value.forEach((v, i) => {
    magicGridFunc(i);
  })
  auth = getAuth();
  // ログイン情報uid取得方法
  // console.log(auth.currentUser.uid);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });

  document.addEventListener('click', (e) => {
    if (deleteMenuCss.value) {
      //.delete-menu以外をクリックしたとき
      if(!e.target.closest('.delete-menu')) {
        deleteMenuClose()
      }
    }
  })
});
onSnapshot(collection(db, "papers"), (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "removed") {
      // parersドキュメントが削除された場合
      // listObjから削除したメモ配列を削除
      const reList = listObj.value.filter((obj) => obj.docId !== change.doc.id)
      listObj.value = []
      listObj.value = reList

      // 日付ごとに分けたメモ配列を更新
      dateDevideArr.value = [];
      dateResult.value = deleteElement(listObj.value.map((obj) => obj.date))
      dateListDevide()

      setTimeout(() => {
        dateResult.value.forEach((v, i) => {
          magicGridFunc(i);
        })
      }, 100);
      // console.log(listObj.value)
    }
  })
})

</script>

<template>
  <header>
    <div class="header-container">
      <h1><RouterLink to="/" class="memo-contents">0秒思考メモ</RouterLink></h1>
      <button @click="handleSignOut" v-if="isLoggedIn">ログアウト</button>
    </div>
  </header>
  <main id="app">
    <div class="left-contents"></div>
    <div class="main-contents"></div>
    <div class="memo-start">
      <RouterLink to="/memo" id="start">0秒思考メモを始める</RouterLink>
    </div>
    <p class="memo-list-ex" v-if="!dateResult.length">ここに保存した0秒思考メモが<span class="in-bl">掲載されます。</span></p>
    <div class="memo-date-list"  v-for="(date, asd) in dateResult">
      <h3 class="dateTitle">{{ date }}</h3>
      <div :class="`memo-group${asd}`">
        <div
          v-for="(memo, index) in dateDevideArr[asd]"
        >
          <div
            class="memo-content"
            :class="{select: memo.index === clickId, delete: id[memo.index] === deleteId}"
            :data-index="memo.index"
            @click="modalOpen(memo.index, $event)"
          >
            <div class="check">
              <img src="../assets/icon/check.svg" alt="" />
            </div>
            <div class="memo-inner">
              <p class="memo-title">{{ memo.title }}</p>
              <ul class="memo-list">
                <li v-for="(list, listIndex) in memo.list">
                  <span class="pointer">－</span>{{ list }}
                </li>
              </ul>
            </div>
            <div class="memo-btn">
              <button class="delete" @click.stop="deleteMenuOpen(memo.index, $event)">
                <img src="../assets/icon/trashbox.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- モーダル -->
    <div class="modal-bg" :class="modalWindow" @click="modalClose">
      <div class="modal" :data-index="clickId">
        <div class="modal-content" @click.stop="deleteMenuClose">
          <div class="modal-memo">
            <div class="memo-head">
              <p class="memo-title">
                <span class="title-text">{{ memoContent.title }}</span>
                <span class="title-border"></span>
              </p>
              <p class="memo-date">{{ memoContent.date }}</p>
            </div>
            <ul class="memo-list">
              <li v-for="(list, listIndex) in memoContent.list">
                <span class="pointer">－</span>{{ list }}
              </li>
            </ul>
          </div>
          <div class="memo-btn">
            <button class="delete" @click.stop="deleteMenuOpen(clickId, $event)">
              <img src="../assets/icon/trashbox.svg" alt="" />
            </button>
            <button class="close" @click.stop="modalClose">閉じる</button>
          </div>
        </div>
      </div>
    </div>
    <!-- メモ削除モーダル -->
    <div class="delete-menu" :style="deleteMenuCss">
      <p @click="delDoc(id[clickId])">メモを削除</p>
    </div>
  </main>
</template>
