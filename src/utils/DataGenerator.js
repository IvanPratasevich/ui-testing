import Fakerator from 'fakerator';

export default class DataGenerator {
  constructor(locale = 'lt-LT') {
    this.fakerator = Fakerator(locale);

    this.genders = ['Male', 'Female', 'Other'];
    this.subjects = [
      'Hindi',
      'English',
      'Maths',
      'Physics',
      'Chemistry',
      'Biology',
      'Computer Science',
      'Commerce',
      'Accounting',
      'Economics',
      'Arts',
      'Social Studies',
      'History',
      'Civics',
    ];
    this.hobbies = ['Sports', 'Reading', 'Music'];
    this.statesAndCities = {
      NCR: ['Delhi', 'Gurgaon', 'Noida'],
      'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
      Haryana: ['Karnal', 'Panipat'],
      Rajasthan: ['Jaipur', 'Jaiselmer'],
    };
    this.picturePath = './assets/images/example.jpeg';
  }

  generateFirstName() {
    return this.fakerator.names.firstName();
  }

  generateLastName() {
    return this.fakerator.names.lastName();
  }

  generateEmail() {
    return this.fakerator.internet.email();
  }

  generateInvalidEmail() {
    const invalidFormats = [
      `${this.fakerator.internet.userName()}@`,
      `@${this.fakerator.internet.domain()}`,
      this.fakerator.internet.userName(),
      `${this.fakerator.internet.userName()}@.`,
    ];
    return this.fakerator.random.arrayElement(invalidFormats);
  }

  generateGender() {
    return this.fakerator.random.arrayElement(this.genders);
  }

  generateMobile() {
    return this.fakerator.random.number(1000000000, 9999999999).toString();
  }

  generateInvalidMobile() {
    const invalidTypes = [
      () => this.fakerator.random.number(100, 999).toString(),
      () => this.fakerator.random.number(10000, 99999).toString(),
      () => this.fakerator.random.number(1, 99).toString(),
      () => this.fakerator.random.string(10),
      () => '',
    ];

    return this.fakerator.random.arrayElement(invalidTypes)();
  }

  generateSubjects(count = 2) {
    const selected = [];
    const available = [...this.subjects];

    for (let i = 0; i < count; i++) {
      const subject = this.fakerator.random.arrayElement(available);
      selected.push(subject);
      available.splice(available.indexOf(subject), 1);
    }

    return selected;
  }

  generateHobbies(count = 1) {
    const selected = [];
    const available = [...this.hobbies];

    for (let i = 0; i < Math.min(count, this.hobbies.length); i++) {
      const hobby = this.fakerator.random.arrayElement(available);
      selected.push(hobby);
      available.splice(available.indexOf(hobby), 1);
    }

    return selected;
  }

  generateAddress() {
    return this.fakerator.address.street();
  }

  generateStateAndCity() {
    const states = Object.keys(this.statesAndCities);
    const state = this.fakerator.random.arrayElement(states);
    const cities = this.statesAndCities[state];
    const city = this.fakerator.random.arrayElement(cities);
    return { state, city };
  }

  generatePicturePath() {
    return this.picturePath;
  }

  generateCompleteFormData() {
    const { state, city } = this.generateStateAndCity();
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      email: this.generateEmail(),
      gender: this.generateGender(),
      mobile: this.generateMobile(),
      subjects: this.generateSubjects(2),
      hobbies: this.generateHobbies(2),
      picture: this.generatePicturePath(),
      address: this.generateAddress(),
      state,
      city,
    };
  }

  generateMandatoryFormData() {
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      gender: this.generateGender(),
      mobile: this.generateMobile(),
    };
  }

  generateFormDataWithInvalidEmail() {
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      email: this.generateInvalidEmail(),
      gender: this.generateGender(),
      mobile: this.generateMobile(),
    };
  }

  generateFormDataWithInvalidMobile() {
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      gender: this.generateGender(),
      mobile: this.generateInvalidMobile(),
    };
  }
}
