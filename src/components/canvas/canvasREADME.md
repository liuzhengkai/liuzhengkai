<!-- 父组件引用 -->
<Canvas :canvas-obj="canvasObj" @canvasClickFn="canvasClickFn"></Canvas>

<script>
  import Canvas from "@/components/canvas/canvas";
  components: {
    Canvas,
  },
  data(){
    return {
       canvasObj: {
        randomNumber: "5678",
        width: "100px",
        height: "30px",
      },
    }
  },
  methods:{
    canvasClickFn() {
      console.log("canvasClickFn");
      this.canvasObj.randomNumber = "5555";
    },
  }
 
  </script>
