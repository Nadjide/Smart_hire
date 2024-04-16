import React, { useState,useContext } from "react";
import {
    VStack,
    Box,
    Center,
    Text,
    Heading,
    Button,
    Radio,
    Image,
    Flex,
} from "native-base";
import AuthContext from '../AuthContext';

export default function QuestionScreen() {

    const { userEmail } = useContext(AuthContext);

    const [questions, setQuestions] = useState([
        {
            title: "La question 1 ?",
            options: ["Réponse 1", "Réponse 2", "Réponse 3"],
            id: 1,
        },
        {
            title: "La question 2 ?",
            options: ["Réponse 1", "Réponse 2", "Réponse 3"],
            id: 2,
        },
        {
            title: "La question 3 ?",
            options: ["Réponse 1", "Réponse 2", "Réponse 3"],
            id: 3,
        },
    ]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState(
        questions.reduce((acc, question) => {
          return { ...acc, [question.id]: "" };
        }, {})
      );

    const handleAnswer = (selectedOption) => {
        setSelectedOptions({
            ...selectedOptions,
            [activeQuestionIndex]: selectedOption,
        });
    };

    const handleNext = () => {
        if (activeQuestionIndex < questions.length - 1) {
            setActiveQuestionIndex(activeQuestionIndex + 1);
        } else {
            console.log("Réponses:", selectedOptions);
        }
    };

    const currentQuestion = questions[activeQuestionIndex];

    return (
        <Flex
            flex={1}
            direction="column"
            justifyContent="center"
            alignItems="center"
            bg="white"
        >
            <Image
                source={require("../assets/logo_smart_hire.png")}
                alt="Smart Hire Logo"
                style={{ height: 150, width: 150, marginBottom: 10 }}
            />
            <Text>Email de l'utilisateur : {userEmail}</Text>
            <Box safeArea p="2" w="90%" maxW="340">
                <VStack space={5} mt="4">
                    <Heading size="lg" textAlign="center" mb="4">
                        {currentQuestion.title}
                    </Heading>
                    <Radio.Group
                        name="myRadioGroup"
                        accessibilityLabel="favorite number"
                        value={selectedOptions[activeQuestionIndex]}
                        onChange={(nextValue) => handleAnswer(nextValue)}
                    >
                        {currentQuestion.options.map((option, index) => (
                            <Radio value={option} my={1} key={index}>
                                {option}
                            </Radio>
                        ))}
                    </Radio.Group>
                    <Button mt="5" onPress={handleNext}>
                        Suivant
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
}
