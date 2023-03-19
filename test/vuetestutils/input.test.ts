import * as TestUtils from '@vue/test-utils';
import InputTextbox from '@/components/input/InputTextbox.vue';
import InputTextarea from '@/components/input/InputTextarea.vue';
import InputCheck from '@/components/input/InputCheck.vue';
import InputRadio from '@/components/input/InputRadio.vue';
import InputRange from '@/components/input/InputRange.vue';
import InputFile from '@/components/input/InputFile.vue';
import InputButton from '@/components/input/InputButton.vue';

describe(`InputTextbox`, () => {
  test(`InputTextbox1`, () => {
    const wrapper = TestUtils.mount(InputTextbox, {props: {type: `text`, modelValue: `テキスト`}});
    expect(wrapper.element.tagName).toBe(`PARTTEXT`);
    expect(wrapper.element.getAttribute(`type`)).toBe(`text`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputTextbox`);
    expect(wrapper.element.getAttribute(`value`)).toBe(`テキスト`);
  });
  test(`InputTextbox2`, () => {
    const wrapper = TestUtils.mount(InputTextbox, {props: {type: `password`, modelValue: `パスワード`}});
    expect(wrapper.element.tagName).toBe(`PARTTEXT`);
    expect(wrapper.element.getAttribute(`type`)).toBe(`password`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputTextbox`);
    expect(wrapper.element.getAttribute(`value`)).toBe(`パスワード`);
  });
});

describe(`InputTextarea`, () => {
  test(`InputTextarea1`, () => {
    const wrapper = TestUtils.mount(InputTextarea, {props: {modelValue: `テキストエリア`}});
    expect(wrapper.element.tagName).toBe(`PARTTEXT`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputTextarea`);
    expect(wrapper.element.innerHTML).toBe(`テキストエリア`);
  });
});

describe(`InputCheck`, () => {
  test(`InputCheck1`, () => {
    const wrapper = TestUtils.mount(InputCheck, {props: {modelValue: true}});
    expect(wrapper.element.tagName).toBe(`PARTLAYOUT`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputCheck`);
    for (const value of Object.values(wrapper.element.children)) {
      expect(value.getAttribute(`checked`)).toBe(`true`);
    }
  });
  test(`InputCheck2`, () => {
    const wrapper = TestUtils.mount(InputCheck, {props: {modelValue: false}});
    expect(wrapper.element.tagName).toBe(`PARTLAYOUT`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputCheck`);
    for (const value of Object.values(wrapper.element.children)) {
      expect(value.getAttribute(`checked`)).toBe(`false`);
    }
  });
});

describe(`InputRadio`, () => {
  test(`InputRadio1`, () => {
    const wrapper = TestUtils.mount(InputRadio, {props: {modelValue: `id`, value: ``}});
    expect(wrapper.element.tagName).toBe(`PARTLAYOUT`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputRadio`);
    for (const value of Object.values(wrapper.element.children)) {
      expect(value.getAttribute(`checked`)).toBe(`false`);
    }
  });
  test(`InputRadio2`, () => {
    const wrapper = TestUtils.mount(InputRadio, {props: {modelValue: `id`, value: `id`}});
    expect(wrapper.element.tagName).toBe(`PARTLAYOUT`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputRadio`);
    for (const value of Object.values(wrapper.element.children)) {
      expect(value.getAttribute(`checked`)).toBe(`true`);
    }
  });
});

describe(`InputRange`, () => {
  test(`InputRange1`, () => {
    const wrapper = TestUtils.mount(InputRange);
    expect(wrapper.element.tagName).toBe(`PARTBASE`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputRange`);
    expect(wrapper.element.getAttribute(`value`)).toBe(`0`);
  });
});

describe(`InputFile`, () => {
  test(`InputFile1`, () => {
    const wrapper = TestUtils.mount(InputFile);
    expect(wrapper.element.tagName).toBe(`PARTLAYOUT`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputFile`);
  });
});

describe(`InputButton`, () => {
  test(`InputButton1`, () => {
    const wrapper = TestUtils.mount(InputButton, {props: {type: `button`}});
    expect(wrapper.element.tagName).toBe(`PARTBASE`);
    expect(wrapper.element.getAttribute(`type`)).toBe(`button`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputButton`);
    expect(wrapper.element.innerHTML).toBe(`ボタン`);
  });
  test(`InputButton2`, () => {
    const wrapper = TestUtils.mount(InputButton, {props: {type: `reset`}});
    expect(wrapper.element.tagName).toBe(`PARTBASE`);
    expect(wrapper.element.getAttribute(`type`)).toBe(`reset`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputButton`);
    expect(wrapper.element.innerHTML).toBe(`ボタン`);
  });
  test(`InputButton3`, () => {
    const wrapper = TestUtils.mount(InputButton, {props: {type: `submit`}});
    expect(wrapper.element.tagName).toBe(`PARTBASE`);
    expect(wrapper.element.getAttribute(`type`)).toBe(`submit`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`inputButton`);
    expect(wrapper.element.innerHTML).toBe(`ボタン`);
  });
});
