import * as TestUtils from '@vue/test-utils';
import PartBase from '@/components/part/PartBase.vue';
import PartLayout from '@/components/part/PartLayout.vue';
import PartText from '@/components/part/PartText.vue';

describe(`PartBase`, () => {
  test(`PartBase1`, () => {
    const wrapper = TestUtils.mount(PartBase);
    expect(wrapper.element.tagName).toBe(`DIV`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`partBase`);
  });
});

describe(`PartLayout`, () => {
  test(`PartLayout1`, () => {
    const wrapper = TestUtils.mount(PartLayout);
    expect(wrapper.element.tagName).toBe(`PARTTEXT`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`partLayout`);
  });
});

describe(`PartText`, () => {
  test(`PartText1`, () => {
    const wrapper = TestUtils.mount(PartText);
    expect(wrapper.element.tagName).toBe(`PARTBASE`);
    expect(wrapper.element.getAttribute(`class`)).toContain(`partText`);
  });
});
