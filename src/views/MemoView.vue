<script setup>
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import { RouterLink } from 'vue-router'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// import Swiper JS
import {Swiper, SwiperSlide} from 'swiper/vue';
import { Navigation } from 'swiper/modules';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// ナビゲーションで使うエレメントのクラスを指定
const useNavigation = {
  prevEl: '.use-prev',
  nextEl: '.use-next'
}

// data
const attTitle = ref("")
const attList = ref([""])
const list = ref([""])
const listHeight = ref([""])
const listIndex = ref(0)
const height = ref("")
const title = ref("")
const min = ref(1)
const sec = ref(0)
const timerOn = ref(false)
const timerObj = ref(null)
const show = ref("")

const memo = ref()
const area = ref()
const inputs = ref()

const memoModalWindow = ref("")
// computed
const styles = computed(() => {
  return {
    height: height.value
  }
})
const formatTime = computed(() => {
  let timeStrings = [min.value.toString(), sec.value.toString()].map(
    (str) => {
      if (str.length < 2) {
        return "0" + str;
      } else {
        return str;
      }
    }
  );
  return timeStrings[0] + ":" + timeStrings[1];
})
const timerColor = computed(() => {
  if (min.value >= 1 || sec.value >= 20) {
    return "safe";
  } else if (sec.value < 20 && sec.value > 0) {
    return "warm";
  } else if (sec.value < 1) {
    return "end";
  }
})

// watch
watch(title, () => {
  resize()
})
watch(() => [...list.value], () => {
  resizeList(listIndex.value)
})

// 今日の日付
const dateFunc = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m =
    now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
  const d = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  return y + "-" + m + "-" + d;
}
const date = ref(dateFunc())

const focus = (index) => {
  listIndex.value = index;
  resizeList(index);
}

// 次のフォーカスに進む
const focusNextInput = (index) => {
  const nextInput =
      memo.value.querySelectorAll("#list textarea")[index + 1];
  if (nextInput) {
    nextInput.focus();
  }
}

// 予測変換を使用しているか
const isComposing = ref(false)
const onCompositionStart =() => {
  isComposing.value = true
}
const onCompositionEnd = () => {
    isComposing.value = false
}

// タイトルから次のフォーカスに進む
const titleNext = (index) => {
  if (!isComposing.value) {
    if (title.value.length > 0) {
      focusNextInput(index)
      attTitle.value = ""
    } else {
      attTitle.value = "タイトルを入力してください。"
    }
  }
}

// リストの追加と次のフォーカスに進む
const addItem = (index) => {
  if (!isComposing.value) {
    if (list.value[index].length > 0) {
      attList.value[index] = "";
      if (index === list.value.length - 1) {
        list.value.push("");
        attList.value.push("");
        nextTick(() => {
          inputs.value[index + 1].focus();
        });
        listHeight.value.push("");
      }
      focusNextInput(index);
    } else {
      attList.value[index] = "文字を入力してください。";
    }
  } else {
    console.log('まだ次のフォーカスには進まないよ')
  }
}

const resize = () => {
  height.value = "auto";
  nextTick(() => {
    height.value = area.value.scrollHeight + "px";
  });
}
const resizeList = (index) => {
  listHeight.value[index] = "auto";
  nextTick(() => {
    if (inputs.value[index]) {
      listHeight.value[index] = inputs.value[index].scrollHeight + "px";
    }
  });
}
const listStyles = (index) => {
  return {
    height: listHeight.value[index]
  }
}
const count = () => {
  if (sec.value <= 0 && min.value >= 1) {
    min.value--;
    sec.value = 59;
  } else if (sec.value <= 0 && min.value <= 0) {
    complete();
  } else {
    sec.value--;
  }
}
const startInput = () => {
  if (timerOn.value === false) {
    start();
  }
}
const start = () => {
  // let self = this;
  timerObj.value = setInterval(() => count(), 1000);
  timerOn.value = true;
}
// const stop = () => {
//   clearInterval(timerObj.value);
//   timerOn.value = false;
// }
const timerReset = () => {
  clearInterval(timerObj.value);
  timerOn.value = false;
  timerObj.value = null;
  min.value = 1;
  sec.value = 0;
}
const complete = () => {
  clearInterval(timerObj.value);
}
const submitConfirm = async () => {
  if (title.value.length === 0) {
    attTitle.value = "タイトルを入力してください。";
    if (list.value[0].length === 0) {
      attList.value[0] = "文字を入力してください。";
    } else {
      attList.value[0] = "";
    }
  } else if (list.value.length < 2 && list.value[0].length === 0) {
    attList.value[0] = "文字を入力してください。";
    // console.log("none");
  } else {
    // console.log("OK");
    list.value = list.value.filter((text, index) => {
      attList.value[index] = "";
      return text.length !== 0;
    });
    list.value.forEach((text, index) => {
      resizeList(index);
    });

    // 入力されたデータをsetする（自動採番のため、積み重なる形で保存される）
    // 非同期処理だから下の処理を待たせる
    await addDoc(collection(db, "papers"), {
      title: title.value,
      list: list.value,
      date: date.value,
      uid: getAuth().currentUser.uid,
      timestamp: serverTimestamp(),
    });

    
    // 全ての処理が終わったらメモのフォームとタイマーリセット
    title.value = "";
    list.value = [""];
    timerReset();
    // location.reload();
  }
}
const showTime = () => {
  show.value === "show" ? (show.value = "") : (show.value = "show");
}

// メモの使い方モーダル
const memoModalOpen = () => {
  memoModalWindow.value = "open";
}
const memoModalClose = () => {
  memoModalWindow.value = "";
}

onMounted(() => {
  area.value.focus();
  resize();
  resizeList(listIndex.value);
})
</script>

<template>
  <header>
    <div class="header-container">
      <h1><RouterLink to="/" class="memo-contents">0秒思考メモ</RouterLink></h1>
      <button @click="memoModalOpen">メモの使い方</button>
    </div>
  </header>
  <main id="memo" ref="memo">
    <div class="left-contents">
      <div id="timer">
        <div class="timer" :class="[timerColor, show]" @click="showTime">
          <div class="timer-icon">
            <img src="../assets/icon/timer.svg" alt="" />
          </div>
          <div class="time">{{ formatTime }}</div>
        </div>
      </div>
    </div>
    <div class="main-contents">
      <div class="w-800">
        <div id="paper">
          <div class="paper_head">
            <h2>
              <textarea
                rows="1"
                cols="10"
                placeholder="ここにタイトルを入力"
                v-model="title"
                ref="area"
                :style="styles"
                @keydown="startInput"
                @keydown.enter.exact.prevent
                @keydown.enter="titleNext(-1)"
                @compositionstart="onCompositionStart"
                @compositionend="onCompositionEnd"
              ></textarea>
              <span class="title-border"></span>
              <span v-html="attTitle" class="att"></span>
            </h2>
            <p><time>{{ date }}</time></p>
          </div>
          <div class="paper_contents">
            <ul id="list">
              <li v-for="(item, index) in list" :key="index">
                <div class="list-flex">
                  <span class="pointer">－</span>
                  <div class="list-input">
                    <span class="input-text_dummy" :style="listStyles(index)"
                      >{{ item }}</span
                    >
                    <textarea
                      rows="1"
                      type="text"
                      v-model="list[index]"
                      ref="inputs"
                      :style="listStyles(index)"
                      @focus="focus(index)"
                      @keydown="startInput"
                      @keydown.enter.prevent
                      @keydown.enter="addItem(index)"
                      @compositionstart="onCompositionStart"
                      @compositionend="onCompositionEnd"
                    ></textarea>
                  </div>
                </div>
                <span v-html="attList[index]" class="att"></span>
              </li>
            </ul>
          </div>
        </div>
        <div class="button-contents">
          <RouterLink to="/" class="memo-contents">メモ一覧へ</RouterLink>
          <button class="keep" type="button" @click="submitConfirm">
            保存
          </button>
        </div>
      </div>
    </div>
    <!-- メモの使い方モーダル -->
    <div class="modal-bg" :class="memoModalWindow" @click="memoModalClose">
      <div class="modal">
        <div class="modal-content" @click.stop>
          <div class="memo-ex">
            <div class="ex-content">
              <swiper :modules="[Navigation]" :navigation="useNavigation">
                <swiper-slide>
                  <picture>
                    <source srcset="../assets/memo-ex/memo-ex01_sp.png" media="(max-width: 699px)">
                    <img src="../assets/memo-ex/memo-ex01.png" alt="">
                  </picture>
                </swiper-slide>
                <swiper-slide>
                  <picture>
                    <source srcset="../assets/memo-ex/memo-ex02_sp.png" media="(max-width: 699px)">
                    <img src="../assets/memo-ex/memo-ex02.png" alt="">
                  </picture>
                </swiper-slide>
              </swiper>
              <div class="swiper-button-prev use-prev"></div>
              <div class="swiper-button-next use-next"></div>
            </div>
            <div class="memo-btn">
              <button class="close" @click.stop="memoModalClose">閉じる</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* 全体 start */
#memo {
  display: flex;
}
.left-contents {
  position: relative;
  min-width: 200px;
  z-index: 1;
}
.main-contents {
  position: relative;
  width: 100%;
  max-width: 1500px;
  margin-bottom: 100px;
}
.w-800 {
  max-width: 800px;
  width: 90%;
  margin: auto;
}
@media (max-width: 699px) {
  .left-contents {
    min-width: 80px;
  }
  .w-800 {
    width: 95%;
    margin: 0;
  }
}
/* 全体 end */

/* メモ start */
.header-container button {
  width: 130px;
}
#paper {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  min-height: 350px;
  padding: 25px 30px;
  margin-bottom: 50px;
}
.paper_head {
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: space-between;
  margin-bottom: 50px;
  gap: 20px;
}
.paper_head h2,
.paper_head h2 textarea {
  font-size: 23px;
  font-weight: bold;
  position: relative;
}
.paper_head h2 {
  display: inline-block;
  width: 400px;
  min-height: 35px;
}
.paper_head h2 textarea {
  border: none;
  width: 100%;
  padding: 0 10px;
}
.paper_head h2 .title-border {
  display: block;
  border-bottom: 2px solid #000;
  width: 100%;
  min-width: 300px;
}
#list .list-flex {
  display: flex;
}
#list .pointer {
  font-weight: bold;
}
#list .list-input {
  position: relative;
  display: inline-block;
  margin-left: 10px;
  max-width: 500px;
  width: 100%;
}
#list textarea {
  font-size: 16px;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
#list .input-text_dummy {
  display: inline-block;
  overflow: hidden;
  min-width: 1em;
  max-width: 100%;
  padding: 0 5px;
  white-space: nowrap;
  opacity: 0;
  height: 100%;
}
#list .input-text_dummy::before {
  content: "";
}
.att {
  display: block;
  font-size: 14px;
  color: #f00;
  margin-top: 10px;
}
h2 .att {
  margin-left: 10px;
}
#list .att {
  margin-top: 0;
  margin-left: 25px;
}
.paper_head p {
  font-size: 20px;
  font-weight: bold;
}

/* メモの使い方モーダル */
.modal-content {
  max-width: 800px;
  width: 95%;
  padding: 15px 30px 20px;
}
.modal-content .ex-content {
  margin-bottom: 20px;
}
.modal .memo-btn {
  justify-content: end;
}
.swiper-button-prev {
  left: 10px;
  top: 42%;
}
.swiper-button-next {
  right: 10px;
  top: 42%;
}
.swiper-button-prev:after, .swiper-button-next:after {
  color: #01e6d2;
  font-size: 40px;
}

@media (max-width: 1199px) {
  .modal-content {
    max-height: 700px;
  }
}

@media (max-width: 699px) {
  .paper_head h2 {
    width: 100%;
    min-width: auto;
  }
  .paper_head p {
    width: 100%;
    text-align: right;
  }
  .paper_head h2,
  .paper_head h2 textarea {
    font-size: 20px;
  }
  .paper_head h2 .title-border {
    min-width: auto;
  }
  #list .list-input {
    width: 90%;
    min-width: auto;
  }
  #list .input-text_dummy {
    display: none;
  }
  #list textarea {
    position: relative;
  }
}
@media (max-width: 499px) {
  li {
    margin-left: 5px;
  }
  #paper {
    padding: 15px 20px;
  }
  .paper_head {
    margin-bottom: 40px;
  }
}
/* メモ end */

/* タイマー start */
#timer {
  text-align: center;
  position: sticky;
  width: 200px;
  top: 50px;
  left: 0;
}
.timer {
  display: flex;
  align-items: center;
  column-gap: 20px;
  width: 100%;
  height: 48px;
  border-radius: 0 25px 25px 0;
  transition: all 0.3s;
}
.timer-icon {
  width: 48px;
  padding: 0 12px;
  flex-shrink: 0;
}
.timer-icon img {
  width: 100%;
  vertical-align: middle;
  color: #000;
}
.timer.safe {
  background: #01e6d2;
}
.timer.warm {
  background: #e6d201;
}
.timer.end {
  background: #ff023d;
}
.timer .time {
  font-size: 30px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.timer button {
  margin-bottom: 10px;
}
@media (max-width: 699px) {
  #timer {
    width: 80px;
  }
  .timer {
    border-radius: 50%;
    width: 48px;
    margin-left: 10px;
    cursor: pointer;
  }
  .timer.show {
    width: 200px;
    margin-left: 0;
    border-radius: 0 25px 25px 0;
  }
  .timer .time {
    font-size: 25px;
    font-weight: bold;
  }
}
/* タイマー end */

/* ボタン start */
.button-contents {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}
.button-contents button,
.button-contents a {
  box-sizing: border-box;
  width: 130px;
  height: 50px;
  line-height: 48px;
  text-align: center;
  font-size: 16px;
  transition: 0.3s all;
}
.button-contents button:hover,
.button-contents a:hover {
  opacity: 1;
}
.button-contents .keep {
  border: 2px solid #000;
  background: #000;
  color: #fff;
}
.button-contents .keep:hover {
  background: #fff;
  color: #000;
}
.button-contents .memo-contents {
  border: 2px solid #000;
  background: #fff;
  color: #000;
}
.button-contents .memo-contents:hover {
  border-color: #000;
  background: #000;
  color: #fff;
}
/* ボタン end */

</style>