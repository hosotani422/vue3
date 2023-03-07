import {render} from '@testing-library/vue';
import InputButton from '@/components/input/InputButton.vue';

describe(`InputButton`, () => {
  test(`InputButton1`, () => {
    const {getByText} = render(InputButton);
    getByText(`ボタン`);
  });
});
