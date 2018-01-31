<template>
  <div>
    <h1>Flow<a>blue</a><span>$blue</span></h1>
  </div>
</template>

<script>

export default {
    name:'flow',
    components:{
    }
}
</script>

<style scoped lang="scss">
  $blue:#1875e7;
  .class1 {
    border:1px solid red;
  }
  @mixin left2($value:10px) {
    float:left;
    margin-left:$value;
  }

  h1 {
    color:#333;
    font-size: 20px;
    font-weight:bold;

    a{
      &:hover { color:yellow; }
      color:blue;
    }

    span {
      color:$blue;
      @extend .class1;
      @include left2(20px);
    }
  }
</style>

